import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {MdOutlineArrowBackIos} from 'react-icons/md'

const DeleteStudent = () => {
  const [studentId, setStudentId] = useState('');
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    if (studentId) {
      axios.get(`http://localhost:5000/students/${studentId}`)
        .then(response => {
          setStudentData(response.data);
        })
        .catch(error => {
          console.error('Error fetching student data:', error);
        });
    }
  }, [studentId]);

  const handleStudentIdChange = (event) => {
    setStudentId(event.target.value);
  };

  const handleDeleteStudent = () => {
    if (studentData && studentData.student_id) {
      axios.delete(`http://localhost:5000/students/${studentData.student_id}`)
        .then(response => {
          alert('Student deleted successfully');
          
        })
        .catch(error => {
          alert("error in deleting student")
        });
    } else {
      alert("No Student data available")
    }
    navigate(-1)
  };

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '5px',
      backgroundColor: '#ffffff',
    },
    input: {
      width: '40%',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      marginBottom: '10px',
      marginLeft:'20px',
      marginRight:'20px'
    },
    button: {
      backgroundColor: '#ff0000',
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
  const navigate=useNavigate()

  return (
    <div style={styles.container}>
            <button onClick={()=>navigate(-1)} style={styles.button}><MdOutlineArrowBackIos style={{paddingRight:"10px",textAlign:'center'}}/>Back to Manage Student</button>

      <h2>Delete Student</h2>
      <div>
        <label>Enter Student ID:</label>
        <input
          type="text"
          value={studentId}
          onChange={handleStudentIdChange}
          style={styles.input}
        />
        <button onClick={handleDeleteStudent} style={styles.button}>
          Delete Student
        </button>
      </div>
      {(studentData && studentId) &&(
        <div style={styles.studentInfo}>
          <h3 style={{fontWeight:'bold'}}>Student Information</h3>
          <p style={{fontWeight:'500'}}>Student ID:<span style={{color:'red'}}>{studentData.student_id}</span> </p>
          <p style={{fontWeight:'500'}}>First Name:<span style={{color:'red'}}> {studentData.first_name}</span></p>
          <p style={{fontWeight:'500'}}>Last Name: <span style={{color:'red'}}>{studentData.last_name}</span> </p>
          <p style={{fontWeight:'500'}}>Class Name:<span style={{color:'red'}}>{studentData.class_name}</span> </p>
          <p style={{fontWeight:'500'}} >date of Birth: <span style={{color:'red'}}>{studentData.date_of_birth}</span> </p>
          <p style={{fontWeight:'500'}}>Guardian Name:<span style={{color:'red'}}> {studentData.guardian_name}</span></p>
          <p style={{fontWeight:'500'}}>Contact: <span style={{color:'red'}}>{studentData.guardian_contact}</span></p>
          
          <p style={{fontWeight:'500'}}>Enrollment Date: <span style={{color:'red'}}>{studentData.enrollment_date}</span></p>
          
        </div>
      )}
    </div>
  );
};

export default DeleteStudent;
