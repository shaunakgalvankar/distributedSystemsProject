const zmq = require('zeromq');

// Create a ZeroMQ pull socket
const receiver = zmq.socket('pull');

// Bind the socket to a TCP address and port
receiver.connect("tcp://127.0.0.1:6000")
console.log("listenning")
// Listen for incoming messages
receiver.on('data', function(msg) {
  // Process the message
  console.log('Received message:');
});