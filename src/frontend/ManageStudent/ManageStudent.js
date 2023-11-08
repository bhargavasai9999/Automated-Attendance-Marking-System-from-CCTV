// ManageStudent.js

import React from 'react';
import { FaSearch, FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './ManageStudent.css'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
const ManageStudent = () => {
  const [showregistration, setshowregistration] = useState(true)

  const navigate=useNavigate()
  return (
    <div>
      <h2>Manage Students Details</h2>
    <div className="manage-student-container">
      
      <div className="student-container" onClick={()=>navigate('/manage-student/addstudent')}>
      
        <div className="student-sub-container" >
          <div className="icon-container">
            <FaUserPlus className="student-icon" />
          </div>
          <h2>Add Student</h2>
          {/* Add your add student content here */}
        </div>
      </div>
      
      <div className="student-container" onClick={()=>navigate('/manage-student/editstudent')}>
        <div className="student-sub-container">
          <div className="icon-container">
            <FaEdit className="student-icon" />
          </div>
          <h2>Edit Student</h2>
        </div>
      </div>

      <div className="student-container" onClick={()=>navigate('/manage-student/deletestudent')}>
        <div className="student-sub-container">
          <div className="icon-container">
            <FaTrash className="student-icon" />
          </div>
          <h2>Delete Student</h2>
        </div>
      </div>
      
    </div>
    </div>
    
  );
};

export default ManageStudent;
