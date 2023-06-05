const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: './video/'})
const express = require('express');

const {NotAuthorizedError} = require("@wyf-ticketing/wyf");
const uuidv4 = require('uuid').v4;
const client = require("../connections/pgClient");
const pathLib = require('path')
const {exec} = require("child_process");
const Extract = require("../Tools/extractImage");

var router = express.Router();
router.post('/api/user/video', upload.single('video'), async (req, res) => {
    if (!req.headers['current']) {
        throw new NotAuthorizedError("Not Authorized");
    }
    const header = req.headers['current'];
    const currentUser = JSON.parse(header);
    const {originalname, path} = req.file;
    const filePath = './userspace/' + originalname
    fs.renameSync(path, filePath);
    // check existence of user folder
    var stats = {}
    const command = `ffprobe  -v quiet -print_format json -show_format -show_entries stream=r_frame_rate ${filePath}`;
    exec(command, (error, stdout, stderr) => {
        const metadata = JSON.parse(stdout);
        stats.size = metadata.format.size
        stats.frameRate = metadata.streams[1].r_frame_rate;
    });
    // await client.query("INSERT INTO videos (id, user_id, name, size, frame_rate) VALUES ($1, $2, $3, $4, $5);",
    //     [uuidv4(), uuidv4(), filePath, stats.size, stats.frameRate], (err) => {
    //     console.error(err)
    // })
    console.log("File:", filePath, "saved!")
    const rawImageAddr = `./images/${currentUser.id}`;
    const processedImageAddr = `./processed/${currentUser.id}`;
    fs.mkdirSync(rawImageAddr);
    fs.mkdirSync(processedImageAddr);
    Extract(filePath, rawImageAddr, processedImageAddr);
    console.log("Successfully uploaded, Meta data saved!");
    res.status(200).send("Successfully uploaded, Meta data saved!");
});

//Delete all Files
router.get('/api/user/deleteAllFiles', async  (req, res) => {
    if (!req.headers['current']) {
        throw new NotAuthorizedError("Not Authorized");
    }
    const header = req.headers['current'];
    const currentUser = JSON.parse(header).currentUser;
    console.log("start deleting")
    await client.query(`DELETE FROM videos WHERE user_id=${currentUser.id};`);
    const userFolderPath = `./userspace/${currentUser.id}`;
    function deleteFolderRecursive(userFolderPath) {
        if (fs.existsSync(userFolderPath)) {
            fs.readdirSync(userFolderPath).forEach((file) => {
                const curPath = pathLib.join(userFolderPath, file);
                if (fs.lstatSync(curPath).isDirectory()) {
                    // delete sub-folders recursively
                    deleteFolderRecursive(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            // delete empty folder
            fs.rmdirSync(userFolderPath);
            console.log(`Deleted folder: ${userFolderPath}`);
        }
    }
    deleteFolderRecursive(userFolderPath);
    console.log("deleted")
    res.status(200).send("All Deleted");
});

module.exports = router