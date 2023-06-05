import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";

const VideoRecorder = () => {
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const [videoData, setVideoData] = useState(null);
  // const [uploadStatus, setUploadStatus] = useState(null);

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
    const videoFile = new File([videoData], Date.now()+".webm", { type: "video/webm" });
    const formData = new FormData();
    formData.append('video', videoFile);
    try {
      // const currentUser_real = (await axios.get('http://containers.prod/api/auth/currentUser')).data;
      const currentUser = {id : 1}
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
      }, (err,{res}) => {
        if (err) console.log(err)
        console.log(res);
      })
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <video ref={videoRef} autoPlay />
      <button onClick={handleStartRecording}>Start Recording</button>
      <button onClick={handleStopRecording}>Stop Recording</button>
      {recordedVideoUrl && (
        <div>
          <h2>Recorded Video</h2>
          <video src={recordedVideoUrl} controls />
          <button onClick={saveVideoAsFile}>Save</button>
          <button onClick={login}>login</button>
          {/*<button onClick={}>Cancel</button>*/}
        </div>
      )}
      {/* {uploadStatus === "success" && (
          <div>
            <h1> File uploaded successfully! </h1>
            <button onClick={setUploadStatus(null)}>Got it</button>
          </div>  
      )} */}
    </div>
  );
};

export default VideoRecorder;
