// SignOut.js

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignOut.css';
import axios from 'axios';
const SignOut = () => {
  const [animationDone, setAnimationDone] = useState(false);
const navigate=useNavigate()

  useEffect(() => {
    setTimeout(() => {
      setAnimationDone(true);
    }, 1000);
    localStorage.removeItem('login')
    axios.get('http://localhost:5000/stop_script')
    .then(res => {
      
    })
    navigate('/')
  }, []);

  return (
    <div className={`sign-out-container ${animationDone ? 'fade-in' : ''}`}>
      <h2>Signout Successful </h2>
      <button  className="login-button" onClick={()=>{
        navigate('/')
      
      }}>
        Login
      </button>
    </div>
  );
};

export default SignOut;
