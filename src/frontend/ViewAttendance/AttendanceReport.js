import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {MdOutlineArrowBackIos} from 'react-icons/md'

const AttendanceReport = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [updatedData, setUpdatedData] = useState({
    student_id: '',
    status: '',
    reason: '',
    date: '',
  });

  const convertDateToFormattedString = (originalDate) => {
    const dateObject = new Date(originalDate);

    const day = dateObject.getUTCDate();
    const month = dateObject.getUTCMonth() + 1; // Months are zero-based, so add 1
    const year = dateObject.getUTCFullYear();

    const formattedDay = (day < 10) ? `0${day}` : day;
    const formattedMonth = (month < 10) ? `0${month}` : month;

    return `${year}-${formattedMonth}-${formattedDay}`;
  }

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const fetchAttendanceData = () => {
    axios.get(`http://3.110.118.195/attendance?class_name=${selectedClass}&date=${selectedDate}`)
      .then(response => {
        setAttendanceData(response.data);
       if(response.data.message)
        alert(response.data.message)
      })
      .catch(error => {
        console.error('Error fetching attendance data:', error);
      });
  };

  useEffect(() => {
    if (selectedClass && selectedDate) {
      fetchAttendanceData();

    }
  }, [selectedClass, selectedDate]);

  const handleEditStatus = (index) => {
    const updatedAttendanceData = [...attendanceData];
    updatedAttendanceData[index].editing = true;
    setUpdatedData(updatedAttendanceData[index]);
    setAttendanceData(updatedAttendanceData);
  };

  const handleUpdateStatus = (index) => {
    const updatedAttendanceData = [...attendanceData];
    updatedAttendanceData[index].editing = false;

    // Check if the data has changed before making an API call
    if (
      updatedData.status !== updatedAttendanceData[index].status ||
      updatedData.reason !== updatedAttendanceData[index].reason
    ) {
      console.log(updatedData)
      axios.put(`http://3.110.118.195/attendance/${updatedData["1"]}`, updatedData)
        .then(response => {
          console.log('Attendance data updated successfully:', response.data);
        })
        .catch(error => {
          console.error('Error updating attendance data:', error);
        });
    }

    setAttendanceData(updatedAttendanceData);
  };

  const handleCancelUpdate = (index) => {
    const updatedAttendanceData = [...attendanceData];
    updatedAttendanceData[index].editing = false;
    
    // Reset the updated data to the original data
    setUpdatedData(updatedAttendanceData[index]);
    setAttendanceData(updatedAttendanceData);
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
    select: {
      width: '100px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      marginBottom: '10px',
    },
    input: {
      width: '150px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      marginBottom: '10px',
      marginRight:'10px'
    },
    button: {
      backgroundColor: 'red',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    infoContainer: {
      marginTop: '20px',
    },
    ul: {
      listStyle: 'none',
      padding: 0,
    },
    li: {
      marginBottom: '10px',
    },
    label: {
      display: 'block',
      fontWeight: 'bold',
    },
    editButton: {
      marginLeft: '10px',
      backgroundColor: 'green',
      color: '#fff',
      padding: '5px 10px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
  };
  const navigate=useNavigate()

  return (
    <div style={styles.container}>
      <button onClick={()=>navigate(-1)} style={styles.button}>
        <MdOutlineArrowBackIos style={{paddingRight:"10px",textAlign:'center'}}/>Back to Manage Attendance</button>

      <h2>Attendance Report</h2>
      <div>
        <label style={styles.label}>Select Class:</label>
        <select
          value={selectedClass}
          onChange={handleClassChange}
          style={styles.input}

        >
          <option value="">Select class</option>
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
      <div>
        <label style={styles.label}>Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          style={styles.input}
        />
      </div>
      <button onClick={fetchAttendanceData} style={styles.button}>
        Fetch Attendance Data
      </button>
      <div style={styles.infoContainer}>
        <h3>Attendance Data</h3>
        {attendanceData.length > 0 ? (
          <ul style={styles.ul}>
            {attendanceData.map((entry, index) => (
              <li key={index} style={styles.li}>
                {entry.editing ? (
                  <>
                    <label>Student ID:</label>
                    <input
                      type="text"
                      value={updatedData.student_id}
                      style={styles.input}
                      name="student_id"
                      readOnly
                    />
                    <label>Status:</label>
                    <select
                      value={updatedData.status}
                      onChange={(e) =>
                        setUpdatedData({ ...updatedData, status: e.target.value })
                      }
                      style={styles.select}
                    >
                      <option value="">Select Status</option>
                      <option value="A">Absent</option>
                      <option value="P">Present</option>
                    </select>
                    <label>Reason:</label>
                    <input
                      type="text"
                      value={updatedData.reason}
                      name="reason"
                      style={styles.input}
                      onChange={(e) =>
                        setUpdatedData({ ...updatedData, reason: e.target.value })
                      }
                    />
                    <label>Date:</label>
                    <input
                      type="text"
                      value={convertDateToFormattedString(entry[2])}
                      style={styles.input}
                      name="date"
                      readOnly
                    />
                    <button
                      onClick={() => handleUpdateStatus(index)}
                      style={styles.editButton}
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleCancelUpdate(index)}
                      style={styles.editButton}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <label>Student ID:</label>
                    <input
                      type="text"
                      value={entry[1]}
                      style={styles.input}
                      name="student_id"
                      readOnly
                    />
                    <label>Status:</label>
                    <input
                      type="text"
                      value={entry[3]}
                      style={styles.input}
                      name="status"
                      readOnly
                    />
                    <label>Reason:</label>
                    <input
                      type="text"
                      value={entry[4]}
                      style={styles.input}
                      name="reason"
                      readOnly
                    />
                    <label>Date:</label>
                    <input
                      type="text"
                      value={convertDateToFormattedString(entry[2])}
                      style={styles.input}
                      name="date"
                      readOnly
                    />
                    <button
                      onClick={() => handleEditStatus(index)}
                      style={styles.editButton}
                    >
                      Edit
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No attendance data available for the selected class and date.</p>
        )}
      </div>
    </div>
  );
};

export default AttendanceReport;
