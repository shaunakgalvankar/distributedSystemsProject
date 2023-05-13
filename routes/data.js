fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: './video/'})
var express = require('express');

var router = express.Router();

router.post('/', upload.single('video'), (req, res) => {
    try {
        // Get the video data from the request body
        console.log('Received file', req.file)
        const { originalname, path } = req.file;
        const newPath = './video/'+originalname
        fs.rename(path, newPath, (err) => {
            if (err) {
                console.error(err);
                res.send({error: 'Failed to save file'});
            } else {
                console.log('File saved:', newPath);
                res.send({message: 'File upload successfully'});
            }
        });
        // const videoData = req;
        // console.log("Start saving file")
        // console.log(videoData)
        // // Process and save the video data on the server
        // // For example, you could save the video data to a file using Node.js's built-in file system module (fs)
        // fs.writeFile('video.mp4', videoData, (err) => {
        //     if (err) throw err;
        //     console.log('Video data saved to file');
        // });
        // // Send a response back to the client
        // res.send('Video data received and saved')
    } catch (err) {
        console.log(err)
    }
});

module.exports = router