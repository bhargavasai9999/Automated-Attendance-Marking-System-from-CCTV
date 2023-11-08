import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Train() {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingResponse, setTrainingResponse] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognitionResponse, setRecognitionResponse] = useState('');

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    width: '150px',
    margin: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
  };

  const containerStyle = {
    textAlign: 'center',
  };

  const handleTrainModel = () => {
    setIsTraining(true);
    setTrainingResponse('');

    // Make an API request to start model training
    axios.get('https://3.110.118.195/train_data')
      .then(response => {
        setIsTraining(false);
        setTrainingResponse(response.data);
      })
      .catch(error => {
        setIsTraining(false);
        setTrainingResponse('Error training the model.');
        console.error(error);
      });
  };

  const handleRecognizeFaces = () => {
    setIsRecognizing(true);
    setRecognitionResponse('');

    // Make an API request to start face recognition
    axios.get('https://3.110.118.195/start_script')
      .then(response => {
        setIsRecognizing(true);
        setRecognitionResponse(response.data);
        console.log(response.data)
      })
      .catch(error => {
        setIsRecognizing(false);
        setRecognitionResponse('Error recognizing faces.');
        console.error(error);
      });
  };

  const handleStopRecognition = () => {
    setIsRecognizing(false);
    setRecognitionResponse('Recognition stopped.');
    // Make an API request to stop the recognition process on the server
    axios.get('https://3.110.118.195/stop_script')
      .then(response => {
        // Handle the response when recognition is stopped (if needed)
      })
      .catch(error => {
        console.error('Error stopping recognition:', error);
      });
  };

  return (
    <div style={containerStyle}>
      <h2>Training model is necessary for recognition after new student registrations <span style={{ color: 'blue' }}>Please click on "Train Your Model"</span></h2>

      <button
        onClick={handleTrainModel}
        disabled={isTraining || isRecognizing}
        style={{ ...buttonStyle, backgroundColor: isTraining ? 'gray' : 'orange', color: 'white' }}
      >
        {isTraining ? 'Training...' : 'Train Your Model'}
      </button>
      <h3 style={{ marginTop: '10px', color: 'red' }}>{trainingResponse}</h3>

      <h2>To mark attendance from CCTV camera footage <span style={{ color: 'blue' }}>Please click on "Run Face Recognition"</span></h2>

      <button
        onClick={handleRecognizeFaces}
        disabled={isTraining || isRecognizing}
        style={{ ...buttonStyle, backgroundColor: isRecognizing ? 'gray' : 'green', color: 'white' }}
      >
        {isRecognizing ? 'Recognizing Faces...' : 'Run Face Recognition'}
      </button>

      {isRecognizing && (
        <button
          onClick={handleStopRecognition}
          disabled={!isRecognizing}
          style={{ ...buttonStyle, backgroundColor: 'red', color: 'white' }}
        >
          Stop Recognition
        </button>
      )}

      <h3>{recognitionResponse}</h3>
    </div>
  );
}

export default Train;
