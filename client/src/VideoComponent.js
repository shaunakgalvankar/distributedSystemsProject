import React, { useState } from 'react';
import Webcam from 'react-webcam';
import { MdPauseCircleOutline, MdPlayCircleOutline, MdStopCircleOutline, MdZoomIn, MdZoomInMap } from 'react-icons/md';
import { FaCalendar } from 'react-icons/fa'


const VideoComponent = () => {
    const [isPaused, setIsPaused] = useState(false);
    const [isStopped, setIsStopped] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLiveMode, setIsLiveMode] = useState(false);
    const webcamRef = React.useRef(null);
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };
    const handleRecord = () => {
        setIsRecording(true);
      };
    
      const handleProcess = () => {
        setIsProcessing(true);
      };
    
      const handleLiveMode = () => {
        setIsLiveMode(true);
      };
    return (
      <div>
        <Webcam
          audio={false}
          height={720}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={1280}
          videoConstraints={videoConstraints}
        />
        <div>
        <button onClick={handleRecord}>Record</button>

        <button onClick={handleProcess}>Process</button>

        <button onClick={handleLiveMode}>Live Mode</button>
        </div>
      </div>
    );
  };
  
  export default VideoComponent;
  