const fs = require('fs')
const zmq = require("zeromq")
const fsExtra = require("fs-extra")
const createVideo = require("../Tools/createVideo");

const socketAddr = "tcp://10.0.0.99:5999";
const sock = new zmq.Pull;
sock.connect(socketAddr);

const listenToWorkerNode = async function (num, rawDirAddr, processedImageAddr, name) {  
  console.log("Image Reducer connected to", socketAddr);
  for (let i = 0; i < num; i++) {
    var [fileName, data] = await sock.receive()
    const name = Buffer.from(fileName).toString('utf-8');
    const dataBuffer = Buffer.from(data);
    fs.writeFileSync(`${processedImageAddr}/${name}`, dataBuffer);
    console.log(name,"Processed and recieved.");
  }
  fsExtra.removeSync(rawDirAddr);
  console.log(rawDirAddr, "Deleted");
  createVideo(processedImageAddr, name)
}

module.exports = listenToWorkerNode;