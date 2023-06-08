import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { Button, Grid, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(3),
  },
  videoContainer: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  video: {
    width: '100%',
    height: 'auto',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  roundedButton: {
    borderRadius: theme.spacing(4),
  },
}));


const VideoRecorder = () => {
  const classes = useStyles();
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMediaStream(stream);
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error(error);
      }
    };
    getMediaStream();
  }, []);

  const handleStartRecording = () => {
    if (mediaStream) {
      const newRecorder = new MediaRecorder(mediaStream, { mimeType: 'video/webm;codecs=vp9' });
      setRecorder(newRecorder);

      const chunks = [];
      newRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      newRecorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: 'video/webm' });
        setVideoData(videoBlob)
        const videoUrl = URL.createObjectURL(videoBlob);
        setRecordedVideoUrl(videoUrl);
      };
      newRecorder.start();
    }
  };

  const handleStopRecording = () => {
    if (recorder && recorder.state === 'recording') {
      recorder.stop();
    }
  };

  const saveVideoAsFile = async () => {
    const videoFile = new File([videoData], Date.now() + ".webm", { type: "video/webm" });
    const formData = new FormData();
    formData.append('video', videoFile);
    try {
      const currentUser = { id: 1 };
      const res = await axios.post('http://localhost:3000/api/user/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Current': JSON.stringify(currentUser)
        }
      });
      console.log("Success!", res);
    } catch (err) {
      console.error('Error Uploading', err)
    }
  }

  async function login() {
    try {
      const data = {
        "email": "dwasffd@scu.com",
        "password": "214dad3"
      }
      const str = JSON.stringify(data);
      await axios.post("http://containers.prod/api/auth/signin", str, {
        headers: {
          'Content-Type': 'application/json'
        }
      }, (err, { res }) => {
        if (err) console.log(err)
        console.log(res);
      })
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={classes.root}>
      <div>
        <video ref={videoRef} autoPlay className={classes.video} />
      </div>
      <div className={classes.buttonContainer}>
      <Button variant="contained" color="primary" className={classes.roundedButton} onClick={handleStartRecording}>
  Start Recording
</Button>
<Button variant="contained" color="secondary" className={classes.roundedButton} onClick={handleStopRecording}>
  Stop Recording
</Button>
      </div>
      {recordedVideoUrl && (
        <div>
          <Typography variant="h6">Recorded Video</Typography>
          <video src={recordedVideoUrl} controls className={classes.video} />
          <div className={classes.buttonContainer}>
          <Button variant="contained" color="primary" className={classes.roundedButton} onClick={saveVideoAsFile}>
  Save
</Button>

          </div>
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;
