const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path')
const Publish = require("../connections/publisher");
const listenToWorkerNode = require('../connections/subscriber');
const fs = require('fs');
const fsExtra = require('fs-extra');
const client = require('../connections/pgClient');

// Tell fluent-ffmpeg where it can find FFmpeg
ffmpeg.setFfmpegPath(ffmpegStatic);

const Extract = function (videoFilePath, outputFolderPath, processedImageAddr, video_id) {
    const videoName = path.basename(videoFilePath);
    const name = path.parse(videoName).name;
    ffmpeg(videoFilePath)
    .output(path.join(outputFolderPath, `${name}-%d.jpeg`))
    .on('end', function() {
        console.log('Frames extracted successfully.');
        const num = fs.readdirSync(outputFolderPath).length
        Publish(outputFolderPath, video_id);
        client.query(
            "SELECT ip, node_name FROM nodes",
            (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
                if (result.rowCount === 0) {
                    console.log("No worker avaiable!!!");
                    fsExtra.removeSync(outputFolderPath);
                    fsExtra.removeSync(processedImageAddr);
                    console.log("Since no worker is availabe, raw images are deleted!");
                    return;
                }
                const load = num / result.rowCount;
                console.log("start working on ",result.rowCount,"machines");
                if (num % result.rowCount == 0) {
                    result.rows.map((row) => {
                        const {ip, node_name} = row;
                        console.log("worker:", node_name, "on:", ip, "start working!!");
                        listenToWorkerNode(load, outputFolderPath, processedImageAddr, name, video_id, ip);
                    });
                } else {
                    for (let i = 0; i < result.rowCount - 1; i++) {
                        const {ip, node_name} = result.rows[i];
                        console.log("worker:", node_name, "on:", ip, "start working!!");
                        listenToWorkerNode(load, outputFolderPath, processedImageAddr, name, video_id, ip);
                    }
                    listenToWorkerNode(num % result.rowCount, outputFolderPath, processedImageAddr, name, video_id, ip);
                }
            }
        )  
    })
    .on('error', function(err) {
        console.error('Error extracting frames:', err);
        if (fs.existsSync(outputFolderPath)) {
            fsExtra.removeSync(outputFolderPath);
        }
    })
    .run();
}
module.exports = Extract;