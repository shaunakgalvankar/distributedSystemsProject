const zmq = require("zeromq");
const puller = zmq.socket("pull");

puller.connect("tcp://127.0.0.1:8000");

puller.on("message", (message) => {
  console.log(`Puller 1 received message: ${message.toString()}`);
});
