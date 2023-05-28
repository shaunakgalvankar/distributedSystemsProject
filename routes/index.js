var express = require('express');
var router = express.Router();
const path = require('path');
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const { exec } = require('child_process');

// Tell fluent-ffmpeg where it can find FFmpeg
ffmpeg.setFfmpegPath(ffmpegStatic);

//View Job
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Put File
router.get('/notexpress', function(req, res, next) {
  res.render('index', { title: 'Not' });
});

//Get File
router.get('/getFile', function(req, res, next) {
  const parentDir = path.join(__dirname, '..');
  const file= parentDir+'/public/book.pdf';
  res.download(file);
  res.render('index', { title: 'Downloaded Successfully' });
});

//Get Video Metadata for File
router.get('/getVideoMetadata', function(req, res, next) {
  const filePath = './video/basketballcopy.MOV'; // Replace with the actual path to your video file

  // Run ffprobe command to get video metadata
  const command = `ffprobe  -v quiet -print_format json -show_format ${filePath}`;
  exec(command, (error, stdout, stderr) => {
    

    const metadata = JSON.parse(stdout);

    console.log(stderr)
    console.log(metadata); // Print metadata to the console

    res.render('index', { title: 'Express' });
  });

});

//Extract Video Images with FrameRate 
router.get('/extractImagesWithFramerate', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Create video from images with framerate
router.get('/createVideoFromImages', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//Detect Face for File
router.get('/detectFace', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Draw Mesh for File
router.get('/drawMesh', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Delete
router.get('/delete', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Delete all Files
router.get('/deleteAllFiles', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
module.exports = router;
