const fs = require('fs')
const zmq = require("zeromq")

async function run() {
  const sock = new zmq.Pull;
  const socketAddr = "tcp://10.0.0.99:5999";
  sock.connect(socketAddr);
  console.log("Image Reducer connected to", socketAddr);

  for await (const msg of sock) {
    const name = Buffer.from(msg[0]).toString('utf-8');
    const dataBuffer = Buffer.from(msg[1]);
    fs.writeFileSync(`processed_${name}`, dataBuffer);
    console.log(name,"Processed and recieved.");
  }
}

run()