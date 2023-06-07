import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProcessedVideoComponent = () => {
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get('/api/videos/example.mp4'); // Replace with the correct endpoint and video filename
        const videoBlob = new Blob([response.data], { type: 'video/mp4' });
        const videoUrl = URL.createObjectURL(videoBlob);
        setVideoUrl(videoUrl);
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };

    fetchVideo();
  }, []);

  return (
    <div>
        <h2>Processed Video</h2>
      {videoUrl ? (
        <video src={videoUrl} controls />
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
};

export default ProcessedVideoComponent;
