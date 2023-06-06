const fs = require('fs')
const zmq = require("zeromq")
const fsExtra = require("fs-extra")
const createVideo = require("../Tools/createVideo");
const client = require('./pgClient');

const listenToWorkerNode = async function (num, rawDirAddr, processedImageAddr, name, video_id, workerAddr) {  
  const sock = new zmq.Pull;
  sock.connect(workerAddr);
  console.log("Image Reducer connected to", workerAddr);
  for (let i = 0; i < num; i++) {
    var [fileName, data] = await sock.receive()
    let oldName = Buffer.from(fileName).toString('utf-8');
    let dataBuffer = Buffer.from(data);
    fs.writeFileSync(`${processedImageAddr}/${oldName}`, dataBuffer);
    const queryStr = `SELECT * FROM tasks WHERE video_id = $1 AND task_name=$2;`;
    client.query(
      queryStr, 
      [video_id, oldName],
      (err, result) => {
        if (err) {
          console.error(err);
          return;
        }
        if (result.rows.length === 0) {
          console.log('No matching rows found.');
          return;
        }
        const row = result.rows[0];
        // console.log(row);
        const {video_id} = row;
        const timestamp = Date.now();
        const pgTimestamp = new Date(timestamp).toISOString();
        client.query("UPDATE tasks SET status=$1, time_finished=$2 WHERE video_id=$3;",
        ["Completed", pgTimestamp, video_id], 
        (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
    });
    console.log(oldName,"Processed and recieved.");
  }
  if (fs.existsSync(rawDirAddr)) {
    fsExtra.removeSync(rawDirAddr);
    console.log(rawDirAddr, "Deleted");
  }
  createVideo(processedImageAddr, name)
}

module.exports = listenToWorkerNode;