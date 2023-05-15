const zmq = require('zeromq');
const fs = require('fs');

// Create ZeroMQ push socket
const publisher = zmq.socket('push');

// Bind the socket to a port
const port = process.argv[2] || 6000;
const address = `tcp://127.0.0.1:${port}`;
publisher.bindSync(address);
console.log(`Publisher bound to ${address}`);

// Define function to read image files from directory
function readImagesFromDirectory(directory) {
  const files = fs.readdirSync(directory);
  const images = files.filter(file => file.endsWith('.jpeg'));
  return images.map(image => {
    const path = `${directory}/${image}`;
    const data = fs.readFileSync(path);
    return data;
  });
}

// Send images from directory
const images = readImagesFromDirectory('jpegdump');
// console.log(images)
images.forEach(image => {
  publisher.send(image);
});
