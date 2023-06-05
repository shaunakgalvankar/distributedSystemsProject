const zmq = require('zeromq');
const fs = require('fs');

const publisher = new zmq.Push;
const socket = "tcp://0.0.0.0:6000";
publisher.bind(socket)

function readImagesFromDirectory(directory) {
  const files = fs.readdirSync(directory);
  const images = files.filter(file => file.endsWith('.jpeg'));
  return images.map(image => {
    const path = `${directory}/${image}`;
    console.log("Getting frame", path);
    const data = fs.readFileSync(path);
    return {data, image};
  });
}

const Publish = async function (outputFolderPath){
  // Create ZeroMQ push socket
  console.log("Producer bound to address", socket)
  // Define function to read image files from directory
  console.log('Start publishing')
  // Send images from directory
  const images = readImagesFromDirectory(outputFolderPath);
  // console.log(images)
  for (const {data, image} of images) {
    await publisher.send([image, data]);
    await new Promise(resolve => { setTimeout(resolve, 500) })
  }
}


module.exports = Publish;


