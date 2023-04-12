var express = require('express');
var router = express.Router();
const path = require('path');

//View Job
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Expres' });
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
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Extract Video Images with FrameRate 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Create video from images with framerate
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Create Video from images with Framerate
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Detect Face for File
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Draw Mesh for File
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Delete
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Delete all Files
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
module.exports = router;
