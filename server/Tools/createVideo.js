const fsExtra = require('fs-extra');
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegStatic);


const createVideo = async function (framesFolderPath, name) {
    ffmpeg()
    .addInput(`${framesFolderPath}/${name}-%d.jpeg`)
    .output(`./video/processed_${name}.webm`)
    .videoCodec('libvpx-vp9')
    .audioCodec('libvorbis') 
    .outputOptions('-pix_fmt', 'yuv420p')
    .on('end', () => {
        console.log('Video conversion complete');
        fsExtra.removeSync(framesFolderPath);
        fsExtra.removeSync(`./userspace/${name}.webm`)
        console.log("Intermediate frames deleted");
        console.log("origin video deleted");
    })
    .on('error', (err) => {
        console.error('Error occurred during video conversion:', err);
        fsExtra.removeSync(framesFolderPath);
        fsExtra.removeSync(`./userspace/${name}.webm`)
        console.log("Intermediate frames deleted");
        console.log("origin video deleted");
    })
    .run();
}

module.exports = createVideo;


