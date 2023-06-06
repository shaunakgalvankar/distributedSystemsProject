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
            "SELECT ip FROM nodes",
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
                result.rows.map((row) => {
                    const {ip} = row;
                    listenToWorkerNode(load, outputFolderPath, processedImageAddr, name, video_id, ip);
                });
                if (num % result.rowCount != 0) {
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