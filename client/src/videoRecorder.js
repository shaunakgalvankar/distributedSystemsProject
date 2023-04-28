import React, { useState, useEffect, useRef } from 'react';

const VideoRecorder = () => {
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  

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

  return (
    <div>
      <video ref={videoRef} autoPlay />
      <button onClick={handleStartRecording}>Start Recording</button>
      <button onClick={handleStopRecording}>Stop Recording</button>
      {recordedVideoUrl && (
        <div>
          <h2>Recorded Video</h2>
          <video src={recordedVideoUrl} controls />
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;
