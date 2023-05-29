const fs = require('fs')
const zmq = require("zeromq")

async function run() {
  const sock = new zmq.Pull

  sock.connect("tcp://127.0.0.1:5999")
  console.log("Worker connected to port 5999")

  for await (const [msg] of sock) {
    fs.writeFileSync("Image.jpeg", msg)
    console.log("work: %s", "recieved")
  }
}

run()