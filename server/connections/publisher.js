const zmq = require('zeromq');
const fs = require('fs');
const client = require('./pgClient');
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

const Publish = async function (outputFolderPath, video_id){
  // Create ZeroMQ push socket
  console.log("Producer bound to address", socket)
  // Define function to read image files from directory
  console.log('Start publishing')
  // Send images from directory
  const images = readImagesFromDirectory(outputFolderPath);
  // console.log(images)
  for (const {data, image} of images) {
    await publisher.send([image, data]);
    const timestamp = Date.now();
    const pgTimestamp = new Date(timestamp).toISOString();
    client.query("INSERT INTO tasks (video_id, task_name, status, time_started, time_finished) VALUES ($1, $2, $3, $4, $5);",
      [video_id, image, "Proceeding", pgTimestamp, null], 
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
  }
}


module.exports = Publish;


