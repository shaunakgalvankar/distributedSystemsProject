const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: './video/'})
const express = require('express');

const {NotAuthorizedError} = require("@wyf-ticketing/wyf");
const uuidv4 = require('uuid').v4;
const client = require("../connections/pgClient");
const pathLib = require('path')
const {exec} = require("child_process");

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
    await client.query("INSERT INTO videos (id, user_id, name, size, frame_rate) VALUES ($1, $2, $3, $4, $5);",
        [uuidv4(), currentUser.id, filePath, stats.size, stats.frameRate], (err) => {
        console.error(err)
    })
    console.log("Successfully uploaded, Meta data saved!");
    res.status(200).send("Successfully uploaded, Meta data saved!");
});
// router.post('/api/user/video', upload.single('video'), async (req, res) => {
//     if (!req.headers['current']) {
//         throw new NotAuthorizedError("Not Authorized");
//     }
//     const header = req.headers['current'];
//     const currentUser = JSON.parse(header).currentUser;
//     const {originalname, path} = req.file;
//     const filePath = './userspace/' + originalname
//     fs.renameSync(path, filePath);
//     const folderPath = `./userspace/${currentUser.id}`;
//     // check existence of user folder
//     if (!fs.existsSync(folderPath)) {
//         fs.mkdirSync(folderPath);
//         fs.mkdirSync(pathLib.join(folderPath, "raw"));
//         fs.mkdirSync(pathLib.join(folderPath, "processed"));
//         console.log(`Created folder: ${folderPath}`);
//     }
//     const fileName = pathLib.basename(filePath);
//     const rawDir = pathLib.join(folderPath, "raw");
//     const destinationPath = pathLib.join(rawDir, fileName);
//     console.log(destinationPath)
//     // check file existence
//     if (fs.existsSync(filePath)) {
//         // move file
//         fs.renameSync(filePath, destinationPath);
//         console.log(`Moved file to folder: ${destinationPath}`);
//     } else {
//         console.log(`File not found: ${filePath}`);
//     }
//     // Get video meta data
//     const stats = {}
//     const command = `ffprobe  -v quiet -print_format json -show_format -show_entries stream=r_frame_rate ${destinationPath}`;
//     exec(command, (error, stdout, stderr) => {
//         const metadata = JSON.parse(stdout);
//         stats.size = metadata.format.size
//         stats.frameRate = metadata.streams[1].r_frame_rate;
//     });
//     console.log(stats.toString());
//     await client.query("INSERT INTO videos (id, user_id, name, size, frame_rate) VALUES ($1, $2, $3, $4, $5);",
//         [uuidv4(), currentUser.id, destinationPath, stats.size, stats.frameRate], (err) => {
//         console.error(err)
//     })
//     console.log("Successfully uploaded, Meta data saved!");
//     res.status(200).send("Successfully uploaded, Meta data saved!");
// });

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