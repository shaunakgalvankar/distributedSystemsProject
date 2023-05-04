var express = require('express');
var router = express.Router();
const path = require('path');
const { Client } = require('pg');

//establish docker credentials
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'silicon@30',
  port: 5432,
});




//View Job
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Expres' });
});

//Put File
router.get('/saveToDB', function(req, res, next) {
  client.connect();
  
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
  res.render('index', { title: 'Express' });
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
