import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {MdOutlineArrowBackIos} from 'react-icons/md'

const EditStudentData = () => {
  const [studentId, setStudentId] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    classname: '1',
    enrollment_date: '',
    address: '',
    guardian_name: '',
    guardian_contact: '',
    profile_photo: null,
  });
  const [editMode, setEditMode] = useState(false);

  const webcamRef = useRef(null);

  const handleStudentIdChange = (event) => {
    setStudentId(event.target.value);
  };
const navigate=useNavigate()
  const handleFetchStudentData = () => {
    // Simulate a GET request to fetch student data using the provided studentId
    // Replace the API endpoint and adjust it to your data structure
    // Make an actual API request with the provided studentId
    setFormData({
      first_name: '',
      last_name: '',
      date_of_birth: '',
      classname: '1',
      enrollment_date: '',
      address: '',
      guardian_name: '',
      guardian_contact: '',
      profile_photo: null,
    })
    axios.get("http://localhost:5000/students/"+studentId).then(res=>{
        const data=res.data;
        
        if(res.data.message){
            alert("studentID not found")
        }

    
    
    setStudentData(data);
    setFormData({ ...data, student_id: studentId }); // Exclude student_id from form data
    setEditMode(true);
}).catch(e=>{
    alert("enter valid StudentID")
})
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCapturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setFormData({ ...formData, profile_photo: imageSrc });
  };

  const handleRecapturePhoto = () => {
    setFormData({ ...formData, profile_photo: null });
  };
  const convertDateToFormattedString = (originalDate) => {
    const dateObject = new Date(originalDate);

    const day = dateObject.getUTCDate();
    const month = dateObject.getUTCMonth() + 1; // Months are zero-based, so add 1
    const year = dateObject.getUTCFullYear();

    const formattedDay = (day < 10) ? `0${day}` : day;
    const formattedMonth = (month < 10) ? `0${month}` : month;

    return `${year}-${formattedMonth}-${formattedDay}`;
  }
  const handleSaveStudentData = () => {
    // Simulate a POST request to update student data
    // Replace the API endpoint and adjust it to your data structure
    // Make an actual API request to update the data
    const updatedData = { ...studentData, ...formData };
    setStudentData(formData);
    console.log(formData)
    axios.put("http://localhost:5000/update_student/"+formData.student_id,formData).then(res=>{

    }).catch(e=>{
        alert("Submit Valid Details may be student Id does not exist")
    })
    setEditMode(false);
    navigate(-1);
  };

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#ffffff',
      maxWidth: '100%',
      margin: '0 auto',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '5px',
    },
    select: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
      },
    h2: {
      textAlign: 'center',
    },
    formContainer: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      marginBottom: '10px',
    },
    button: {
      backgroundColor: '#007BFF',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    studentInfo: {
      marginTop: '20px',
    },
  };

  return (
    <div style={styles.container}>
    <button onClick={()=>navigate(-1)} style={styles.button}><MdOutlineArrowBackIos style={{paddingRight:"10px",textAlign:'center'}}/>Back to Manage Student</button>

      <h2 style={styles.h2}>Edit Student Details</h2>
      <div style={styles.formContainer}>
        <label style={styles.label}>Enter Student ID:</label>
        <input
          type="text"
          value={studentId}
          onChange={handleStudentIdChange}
          style={styles.input}
          required
        />
        <button onClick={handleFetchStudentData} style={styles.button}>
          Fetch Data
        </button>
      </div>
      {studentData && (
        <div style={styles.studentInfo}>
          {editMode ? (
            <div>
              <h3>Edit Student Information</h3>
              <form>
              <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="student_id">Student ID:</label>
          <input
            style={styles.input}
            type="text"
            id="student_id"
            name="student_id"
            value={studentId}
            onChange={handleInputChange}
          readOnly/>
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
            value={convertDateToFormattedString(formData.date_of_birth)}
            onChange={handleInputChange}
            required
          />
        </div>
        <div style={styles.formGroup} >
          <label style={styles.label} htmlFor="classname" >Class Name:</label>
          <select
            style={styles.select}
            id="classname"
            name="classname"
            value={formData.class_name}
            onChange={handleInputChange}
          >
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
            value={convertDateToFormattedString(formData.enrollment_date)}
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
                {/* Add other form fields here */}
                <div style={styles.formContainer} id="video-container">
                  <label style={styles.label}>Profile Photo:</label>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    style={styles.webcam}
                    height="250px" width="250px"/><br/>
                  <button
                    type="button"
                    style={styles.button}
                    onClick={handleCapturePhoto}
                  >
                    Capture Photo
                  </button>
                  <button
                    type="button"
                    style={styles.button}
                    onClick={handleRecapturePhoto}
                    style={{ display: formData.profile_photo ? 'block' : 'none' }}
                  >
                    Recapture Photo
                  </button>
                  {formData.profile_photo && (
                    <img
                      alt="Profile Photo"
                      src={formData.profile_photo}
                      style={styles.img} height="200px" width="200px"
                      required
                    />
                  )}
                  <input
                    type="hidden"
                    name="profile_photo"
                    value={formData.profile_photo || ''}
                    required
                  />
                </div>
                <div style={styles.formContainer}>
                  <button onClick={handleSaveStudentData} style={styles.button}>
                    Save
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <h3>Student Information</h3>
              <p>Student ID: {studentData.student_id}</p>
              <p>First Name: {studentData.first_name}</p>
              {/* Display other student information here */}
              <button
                onClick={() => setEditMode(true)}
                style={styles.button}
              >
                Edit
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditStudentData;
