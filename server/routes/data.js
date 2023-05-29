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
    } catch (err) {
        console.log(err)
    }
});

module.exports = router