import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {MdOutlineArrowBackIos} from 'react-icons/md'

const StudentAttendance = () => {
  const [studentId, setStudentId] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    student_id: studentId,
    status: '',
    reason: '',
    date: '',
  });
  const [originalData, setOriginalData] = useState(null);

  const handleStudentIdChange = (event) => {
    setStudentId(event.target.value);
  };

  const handleFetchAttendanceData = () => {
    // Make an API request to fetch attendance data for the specified student ID
    axios.get(`https://3.110.118.195/attendance/${studentId}`)
      .then(response => {
        setAttendanceData(response.data);
        console.log(response)
        if((response.data.length===0)){
          alert("no attendance record found on student ID")
        }
      })
      .catch(error => {
        console.error('Error fetching attendance data:', error);
      });
  };

  const handleEdit = (data) => {
    setIsEditing(true);
    // Set editedData to the values of the selected attendance record
    setOriginalData({ ...data });
    setEditedData({ ...data });
  };

  const handleUpdate = () => {
    console.log(editedData)
    // Make an API request to update the attendance record
    axios.put(`https://3.110.118.195/attendance/${studentId}`, editedData)
      .then(response => {
        console.log('Attendance record updated successfully:', response.data);
        setIsEditing(false);
      })
      .catch(error => {
        console.error('Error updating attendance record:', error);
      });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (originalData) {
      setEditedData({ ...originalData });
    }
  };

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '100%',
      margin: '0 auto',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '5px',
      backgroundColor: '#ffffff',
    },
    input: {
      width: '400px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      marginBottom: '10px',
      marginRight:'20px'
    },
    button: {
      backgroundColor: 'red',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      marginLeft:'20px',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    strong:{
      paddingRight:'20px',marginLeft:'20px'
    },
    li:{
      marginRight:'20px',
    }
  };

  const convertDateToFormattedString = (originalDate) => {
    const dateObject = new Date(originalDate);

    const day = dateObject.getUTCDate();
    const month = dateObject.getUTCMonth() + 1; 
    const year = dateObject.getUTCFullYear();

    const formattedDay = (day < 10) ? `0${day}` : day;
    const formattedMonth = (month < 10) ? `0${month}` : month;

    return `${year}-${formattedMonth}-${formattedDay}`;
  };
  const navigate=useNavigate()

  return (
    <div style={styles.container}>
      <button onClick={()=>navigate(-1)} style={styles.button}> <MdOutlineArrowBackIos style={{paddingRight:"10px"}}/>Back to Manage Attendance</button>

      <h2>Student Attendance</h2>
      <input
        type="text"
        placeholder="Enter Student ID"
        value={studentId}
        onChange={handleStudentIdChange}
        style={styles.input}
      />
      <button onClick={handleFetchAttendanceData} style={styles.button}>
        Fetch Attendance Data
      </button>
      {attendanceData.length > 0 && (
        <div>
          {isEditing ? (
            <div>
              <h3>Edit Attendance Record</h3>
              <select
                value={editedData.status}
                onChange={(e) => setEditedData({ ...editedData, status: e.target.value })}
                style={styles.input}
              >
                <option value="">Select Attendance</option>
                <option value="A">Absent</option>
                <option value="P">Present</option>
              </select>
              <input
                type="text"
                placeholder="Reason"
                value={editedData.reason}
                onChange={(e) => setEditedData({ ...editedData, reason: e.target.value })}
                style={styles.input}
              />
            
              <button onClick={handleUpdate} style={styles.button}>
                Update
              </button>
              <button onClick={handleCancelEdit} style={styles.button}>
                Cancel
              </button>
            </div>
          ) : (
            <ul>
              <h2>Fetched student Attendance</h2>
              {attendanceData.map((data, index) => (
                <li key={index} style={{listStyle:'decimal',margin:'20px',fontWeight:'500'}}>
                  <div style={{alignContent:'space-evenly',position:'relative'}}>
                    <strong style={{paddingLeft:'10px'}}>Status:</strong> {data[3]}
                  
                  
                    <strong style={{paddingLeft:'20px'}}>Reason:</strong> {data[4]}
                 
                    <strong style={{paddingLeft:'20px'}}>Date:</strong> {convertDateToFormattedString(data[2])}
                 
                  <button onClick={() => handleEdit(data)} style={styles.button}>
                    Edit
                  </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;
