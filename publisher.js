const zmq = require("zeromq");
const pusher = zmq.socket("push");

pusher.bindSync("tcp://127.0.0.1:8000");

let i = 0;
setInterval(() => {
  const message = `Message ${i++}`;
  console.log(`Sending message: ${message}`);
  pusher.send(message);
}, 1000);
