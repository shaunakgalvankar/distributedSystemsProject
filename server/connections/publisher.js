const zmq = require('zeromq');
const fs = require('fs');

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

async function init() {
  // Create ZeroMQ push socket
  const publisher = new zmq.Push;
  const socket = "tcp://0.0.0.0:6000";
  await publisher.bind(socket)
  console.log("Producer bound to address", socket)
  // Define function to read image files from directory
  console.log('Start publishing')
  // Send images from directory
  const images = readImagesFromDirectory('jpegdump');
  // console.log(images)
  for (const {data, image} of images) {
    await publisher.send([image, data]);
    await new Promise(resolve => { setTimeout(resolve, 500) })
  }
}

init();


