// ManageAttendance.js

import React from 'react';
import { FaCalendarAlt, FaUsers } from 'react-icons/fa';
import { Sidebar } from 'react-pro-sidebar';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

const ManageAttendance = () => {
const navigate=useNavigate()
  
  return (
    
    <div>
      <h2>Manage Student's Attendance</h2>
    <div className="manage-attendance-container" >
      

      <div className="attendance-container" onClick={()=>navigate('/manage-attendance/classattendance')}>
        <div className="icon-container">
          <FaCalendarAlt className="attendance-icon" />
        </div>
        <h2>Class Attendance</h2>
        {/* Add your class attendance content here */}
      </div>
      
      <div className="attendance-container" onClick={()=>navigate('/manage-attendance/studentattendance')}>
        <div className="icon-container">
          <FaUsers className="attendance-icon" />
        </div>
        <h2>Student Attendance</h2>
        {/* Add your student attendance content here */}
      </div>
    </div>
    </div>
  );
};

export default ManageAttendance;
