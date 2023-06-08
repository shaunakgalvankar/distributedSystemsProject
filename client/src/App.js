import './App.css';
import ProcessedVideoComponent from './processedVideoComponent';
import VideoRecorder from './videoRecorder';

function App() {
  
  const appStyle = {
    backgroundColor: '#154360   ', // Set the desired dark color
    // Add any other desired styles for the App component
  };
  return (
    <div className="App" style={appStyle}>
      <VideoRecorder></VideoRecorder>
      <ProcessedVideoComponent></ProcessedVideoComponent>
    </div>
    
  );
}
export default App;
