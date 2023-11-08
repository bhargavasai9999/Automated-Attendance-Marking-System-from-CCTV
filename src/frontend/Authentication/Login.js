import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'
const Login = () => {
  const userData = [
    { userId: 'admin', password: 'admin' },
    { userId: 'admin2', password: 'admin2' },
  ];

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
const navigate=useNavigate()
useEffect(()=>{
  const items=localStorage.getItem('login')
  if(items){
    navigate('/dashboard')
  }
},[])
  const handleLogin = () => {
    // Check if the provided user credentials match any entry in the data array
    const user = userData.find((user) => user.userId === userId && user.password === password);

   
    if (user) {
      // Successful login
      setLoginError('');
      alert('Login successful!');
      localStorage.setItem('login', true);
      if(localStorage.getItem('login')){
        navigate("/dashboard")
      }

    } else {
      setLoginError('Invalid userID or Password');
    }
  };

  return (
    <div style={{height:'100vh',width:'100vw'}} className='login-bg'>
    <div style={containerStyle}>
      <h2 style={headerStyle}>Admin Login</h2>
      <div style={inputContainerStyle}>
        <label style={labelStyle}>User ID:</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={inputContainerStyle}>
        <label style={labelStyle}>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
      </div>
      <button style={loginButtonStyle} onClick={handleLogin}>Login</button>
      {loginError && <p style={errorStyle}>{loginError}</p>}
    </div>
    </div>
  );
};

const containerStyle = {
  fontFamily: 'Arial',
  width: '300px',

  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  textAlign:'center',
  backgroundColor:'#ffffff',
  margin:'auto',
  marginTop:'140px '
};

const headerStyle = {
  fontSize: '24px',
 
};

const inputContainerStyle = {
  marginBottom: '15px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '5px',
};

const inputStyle = {
  width: '80%',
  padding: '8px',
  borderRadius:'5px'

};

const loginButtonStyle = {
  backgroundColor: '#007BFF',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  cursor: 'pointer',
  borderRadius:'5px'
};

const errorStyle = {
  color: 'red',
  textAlign: 'center',
};

export default Login;
