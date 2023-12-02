import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css'
function Dashboard() {
  const [students, setStudents] = useState([]);

  useEffect(() =>{
    axios.get(`http://localhost:5000/student_details`).then(res=>{
      setStudents(res.data);
      console.log(res)
      if(res.data.message){
        // alert("It looks like today Holiday")
      }
    })
  }, [2]);


  const toggleStatus = (studentId) => {
    const studentToUpdate = students.find(student => student.student_id === studentId);
    const updatedStatus = studentToUpdate.attendance_status === 'P' ? 'A' : 'P';

    // Send a PUT request to update the attendance status for the specific student
    axios.put(`http://localhost:5000/update_attendance_today`, {
      student_id: studentId,
      attendance_status: updatedStatus,
    }).then(response => {
      if (response.data.message === 'Attendance status updated successfully') {
        setStudents(prevStudents =>
          prevStudents.map(student =>
            student.student_id === studentId
              ? { ...student, attendance_status: updatedStatus }
              : student
          )
        );
      } else {
        console.error(response.data.error);
      }
    }).catch(error => {
      console.error(error);
    });
  };

  return (
    <div className="App">
      <h2>Today's Attendance</h2>
      <div className="student-list">
        {(students.length>0) ?( students.map((student) => (
          <div key={student.student_id} className="student">
          <img src={student.image} className='student-img'/>
            <div className="student-info container">
            <p className='student-class'>Student ID: {student.student_id}</p>
              {`${student.first_name} ${student.last_name}`}
            </div>
            <p className='student-class'>Class {student.class}</p>
            <button
              onClick={() => toggleStatus(student.student_id)}
              className={`status-button button ${
                student.attendance_status === 'P' ? 'present' : 'absent'
              }`}
            >
              {student.attendance_status === 'P' ? 'Present' : 'Absent'}
            </button>
          </div>
        ))):(<h2 style={{textAlign:'center',color:'blueviolet'}}>It looks like holiday today... "If not run face recognition"</h2>)}
      </div>
    </div>
  );
}

export default Dashboard;
