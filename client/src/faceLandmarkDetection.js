import React, { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import  facemesh from '@tensorflow-models/facemesh';

function FaceLandmarkDetection() {
  const videoRef = useRef(null);

  useEffect(() => {
    async function loadFacemeshModel() {
      await tf.setBackend('webgl');
      await tf.ready();

      const model = await facemesh.load();

      // Start capturing video stream
      const video = videoRef.current;
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.play();

      // Run facial landmark detection on video frames
      async function detectFacialLandmarks() {
        const predictions = await model.estimateFaces(video);
        // Process the predictions and perform any necessary actions
        console.log(predictions);
        requestAnimationFrame(detectFacialLandmarks);
      }

      detectFacialLandmarks();
    }

    loadFacemeshModel();
  }, []);

  return (
    <div>
      <h1>Facial Landmark Detection Component</h1>
      <video ref={videoRef} width="640" height="480" />
    </div>
  );
}

export default FaceLandmarkDetection;
