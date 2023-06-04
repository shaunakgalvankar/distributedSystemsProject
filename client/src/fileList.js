import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/files');
    console.log()
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const FileList = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const data = await fetchData();
      setFiles(data);
    };

    fetchFiles();
  }, []);

  return (
    <div>
    <h2>Files:</h2>
    <ul>
      {files.map((file, index) => (
        <li key={index}>
          {file}
          <button>Process</button>
          
        </li>
      ))}
    </ul>
  </div>
  
  );
};

export default FileList;
