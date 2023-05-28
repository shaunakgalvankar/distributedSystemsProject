const zmq = require('zeromq');
const fs = require('fs');

function readImagesFromDirectory(directory) {
  const files = fs.readdirSync(directory);
  const images = files.filter(file => file.endsWith('.jpeg'));
  return images.map(image => {
    const path = `${directory}/${image}`;
    const data = fs.readFileSync(path);
    return data;
  });
}

async function init() {
  // Create ZeroMQ push socket
  const publisher = new zmq.Push
  await publisher.bind("tcp://0.0.0.0:3587")
  console.log("Producer bound to port 3587")
  // Define function to read image files from directory
  console.log('Start publishing')
  // Send images from directory
  const images = readImagesFromDirectory('jpegdump');
  // console.log(images)
  for (const image of images) {
    await publisher.send(image);
    await new Promise(resolve => { setTimeout(resolve, 500) })
  }
}

init();


