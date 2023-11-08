import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {MdOutlineArrowBackIos} from 'react-icons/md'
import useEffect from 'react'

const StudentRegistrationForm = () => {
  const webcamRef = useRef(null);
  const [webcamVisible, setWebcamVisible] = useState(true);

  const navigate=useNavigate()

  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    classname: '',
    enrollment_date: '',
    address: '',
    guardian_name: '',
    guardian_contact: '',
    profile_photo: null,
    photoPreviewVisible: false,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

  };

  const handleCaptureProfilePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setFormData({
        ...formData,
        profile_photo: imageSrc,
        photoPreviewVisible: true,
      });
    }
    setWebcamVisible(false); // Close the webcam after capturing

  };

  const handleRecaptureProfilePhoto = () => {
    setFormData({
      ...formData,
      profile_photo: null,
      photoPreviewVisible: false,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    axios.post("http://3.110.118.195/addstudents",formData).then(res=>{
        if(res.data)
        alert(res.data)
    })
    // You can submit the form data to your server here.
    // Access the form data from the formData state and send it as needed.
    // Remember to handle the profile photo as well.
    // event.target.reset()
    setFormData({
        student_id: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        classname: '1',
        enrollment_date: '',
        address: '',
        guardian_name: '',
        guardian_contact: '',
        profile_photo: null,
        photoPreviewVisible: false,
      })
      navigate(-1)
    
  };

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#ffffff',
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '5px',
    },
    h2: {
      textAlign: 'center',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      fontWeight: 'bold',
      display: 'block',
    },
    input: {
      width: '90%',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    select: {
      width: '92%',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    button: {
      backgroundColor: '#007BFF',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    videoContainer: {
      textAlign: 'center',
    },
    webcam: {
      width: '200px',
      height: '200px',
    },
    img: {
      width: '200px',
      height: '200px',
    },
  };
 
  return (
    <div style={styles.container}>
      <button onClick={()=>navigate(-1)} style={styles.button}><MdOutlineArrowBackIos style={{paddingRight:"10px",textAlign:'center'}}/>Back to Manage Student</button>
      <h2 style={styles.h2}>Student Registration</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="student_id">Student ID:</label>
          <input
            style={styles.input}
            type="text"
            id="student_id"
            name="student_id"
            value={formData.student_id}
            onChange={handleInputChange}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="first_name">First Name:</label>
          <input
            style={styles.input}
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="last_name">Last Name:</label>
          <input
            style={styles.input}
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="date_of_birth">Date of Birth:</label>
          <input
            style={styles.input}
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleInputChange}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="classname">Class Name:</label>
          <select
            style={styles.select}
            id="classname"
            name="classname"
            value={formData.classname}
            onChange={handleInputChange}
          selectOnly required>
            <option value=''>Select class</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="enrollment_date">Admission Date:</label>
          <input
            style={styles.input}
            type="date"
            id="enrollment_date"
            name="enrollment_date"
            value={formData.enrollment_date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="address">Address:</label>
          <input
            style={styles.input}
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="guardian_name">Guardian Name:</label>
          <input
            style={styles.input}
            type="text"
            id="guardian_name"
            name="guardian_name"
            value={formData.guardian_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="guardian_contact">Guardian Contact:</label>
          <input
            style={styles.input}
            type="tel"
            id="guardian_contact"
            name="guardian_contact"
            value={formData.guardian_contact}
            onChange={handleInputChange}
            required
          />
        </div>
        <div style={styles.formGroup} id="video-container">
          <label style={styles.label} htmlFor="profile_photo">Profile Photo:</label>
          {webcamVisible && <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={styles.webcam}
          />}
          <button type="button" style={styles.button} onClick={handleCaptureProfilePhoto}>
            Capture Photo
          </button>
          <button type="button" style={styles.button} onClick={handleRecaptureProfilePhoto}>
            Recapture Photo
          </button>
          {formData.photoPreviewVisible && (
            <img
              alt="Profile Photo"
              src={formData.profile_photo}
              style={styles.img}
              required
            />
          )}
          <input
            type="hidden"
            id="profile_photo"
            name="profile_photo"
            value={formData.profile_photo || ''}
          />
        </div>
        <p>please click on capture train images for face recognition and wait for pop up </p>
        <button style={styles.button} onClick={()=>axios.get("http://3.110.118.195/train_images")}> capture train images</button>
        <div style={styles.formGroup}>
          <button type="submit" style={styles.button}>Register</button>
        </div>
      </form>
    </div>
  );
};

export default StudentRegistrationForm;
