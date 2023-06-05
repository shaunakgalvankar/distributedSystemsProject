const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path')
const Publish = require("../connections/publisher");
const listenToWorkerNode = require('../connections/subscriber');
const fs = require('fs');
const fsExtra = require('fs-extra');

// Tell fluent-ffmpeg where it can find FFmpeg
ffmpeg.setFfmpegPath(ffmpegStatic);

const Extract = function (videoFilePath, outputFolderPath, processedImageAddr) {
    const videoName = path.basename(videoFilePath);
    const name = path.parse(videoName).name;
    ffmpeg(videoFilePath)
    .output(path.join(outputFolderPath, `${name}-%d.jpeg`))
    .on('end', function() {
        console.log('Frames extracted successfully.');
        const num = fs.readdirSync(outputFolderPath).length
        Publish(outputFolderPath);
        listenToWorkerNode(num, outputFolderPath, processedImageAddr, name);
    // res.render('index', { title: 'Express' });
    })
    .on('error', function(err) {
        console.error('Error extracting frames:', err);
        if (fs.existsSync(outputFolderPath)) {
            fsExtra.removeSync(outputFolderPath);
        }
    // res.status(500).send('Error extracting frames');
    })
    .run();
}

module.exports = Extract;