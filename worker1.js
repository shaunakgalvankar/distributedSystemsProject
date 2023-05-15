const zmq = require('zeromq');
const fs = require('fs');

// Create ZeroMQ pull socket
const subscriber = zmq.socket('pull');

// Connect the socket to the publisher
const port = process.argv[2] || 5999;
const address = `tcp://172.20.10.2:${port}`;
subscriber.connect(address);
console.log(`Subscriber connected to ${address}`);

// Define function to process image data
function processImage(imageData) {
  // Do something with the image data
  const { path, data } = imageData;
  console.log(`Processing image at ${path}`);
}

// Listen for messages from publisher
subscriber.on('message', data => {
  const imageData = JSON.parse(data.toString());
  processImage(imageData);
});

