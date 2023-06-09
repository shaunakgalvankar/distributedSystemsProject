var express = require('express');
var router = express.Router();
const path = require('path');
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const { exec } = require('child_process');
const fs = require('fs')
// Tell fluent-ffmpeg where it can find FFmpeg
ffmpeg.setFfmpegPath(ffmpegStatic);

//get Processed Video
const videoFilePath='/server/video/'
router.get('/getProcessedVideo',(req,res,next)=>{
  const filename=req.params.filename;
  const videoPath=path.join(videoFilePath,filename);
  res.sendFile(videoPath)
});

//View Job
router.get('/api/user', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Put File
router.get('/api/user/notexpress', function(req, res, next) {
  res.render('index', { title: 'Not' });
});

//Get File
router.get('/api/user/getFile', function(req, res, next) {
  const parentDir = path.join(__dirname, '..');
  const file= parentDir+'/public/book.pdf';
  res.download(file);
  res.render('index', { title: 'Downloaded Successfully' });
});

//Get Video Metadata for File
router.get('/api/user/getVideoMetaData', function(req, res, next) {
  const filePath = './video/1685751202767.webm'; // Replace with the actual path to your video file

  // Run ffprobe command to get video metadata
  const command = `ffprobe  -v quiet -print_format json -show_format -show_entries stream=r_frame_rate ${filePath}`;
  exec(command, (error, stdout, stderr) => {
    const metadata = JSON.parse(stdout);
    console.log(stderr)
    console.log(metadata); // Print metadata to the console
    res.render('index', { title: 'Express' });
  });

});

//Extract Video Images with FrameRate 
router.get('/api/user/extractImagesWithFramerate', function(req, res, next) {
  const videoFilePath = './video/IMG_0685.MOV';
  const outputFolderName = 'basketballcopy_frames';
  const outputFolderPath = path.join(__dirname, '..', outputFolderName);
  // Create the output folder if it doesn't exist
  if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath);
  }

  // Extract frames from the video using ffmpeg
  ffmpeg(videoFilePath)
    .output(path.join(outputFolderPath, 'frame-%d.png'))
    .on('end', function() {
      console.log('Frames extracted successfully.');
      res.render('index', { title: 'Express' });
    })
    .on('error', function(err) {
      console.error('Error extracting frames:', err);
      res.status(500).send('Error extracting frames');
    })
    .run();
    res.render('index', { title: 'Express' });
});
    


//Create video from images with framerate
router.get('/api/user/createVideoFromImages', async function(req, res, next) {
  const framesFolderPath = path.join(__dirname, '..', 'basketballcopy_frames');
  const outputVideoPath = path.join(__dirname, '..', 'basketballcopy_converted.mp4');

  // Execute the FFmpeg command to convert frames to a video
  const ffmpegCommand = `ffmpeg  -i "${framesFolderPath}/frame-%d.png" -c:v libx264 -pix_fmt yuv420p "${outputVideoPath}"`;
  await exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('Error converting frames to video:', error);
      res.status(500).send('Error converting frames to video');
      return;
    }
    res.send('Frames converted to video successfully.');
  });
  
});

//Detect Face for File
router.get('/api/user/detectFace', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Draw Mesh for File
router.get('/api/user/drawMesh', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;
