
import React, { useState } from 'react';
import logo from '../Home/gprec-removebg-preview.png'
import './Sidebar.css';
import { FaHome, FaSearch, FaCalendar, FaGraduationCap, FaSignOutAlt, FaPhone, FaCamera, FaUser, FaClock } from 'react-icons/fa';
import ManageStudent from '../ManageStudent/ManageStudent';
import ManageAttendance from '../ManageAttendance/ManageAttendance.js';
import SearchData from '../SearchStudent/SearchData';
import ContactUs from '../ContactUs/ContactUs';
import SignOut from '../SignOut/SignOut';
import { Route, Routes,BrowserRouter as Router, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Dashboard from '../Dashboard/Dashboard';
import Train from '../FaceReconition/Train.js'
import Camera from '../cameras/Camera';
const Sidebar = () => {
  const navigate=useNavigate()
  const location=useLocation()
  let path=location.pathname
  path=path.slice(1,)
  const [currentPage, setCurrentPage] = useState(path);
  const sidebarItems = [
    { label: 'Dashboard', id: 'dashboard' },
    { label: 'Search Student', id: 'search-student' },
    { label: 'Manage Attendance', id: 'manage-attendance' },
    { label: 'Manage Student', id: 'manage-student' },
    ,
    { label: 'Contact Us', id: 'contact-us' },
    { label: 'Configure Cameras', id: 'configure-cameras' },
    { label: 'Run Face Recognition', id: 'run-face-recognition' },
    { label: 'Sign Out', id: 'sign-out' }

  ];
useEffect(()=>{
  
},[])
  const getIconForItem = (itemId) => {
    switch (itemId) {
      case 'dashboard':
        return <FaHome />;
      case 'search-student':
        return <FaSearch />;
      case 'manage-attendance':
        return <FaCalendar />;
      case 'manage-student':
        return <FaGraduationCap />;
      case 'sign-out':
        return <FaSignOutAlt />;
      case 'contact-us':
        return <FaPhone />;
      case 'configure-cameras':
        return <FaCamera />;
      case 'run-face-recognition':
        return <FaUser />;
      default:
        return null;
    }
  };


  return (
    <div className="app">
      <div className="sidebar">
        <img src={logo} style={{height:'50px'}}/>
        <div className="logo">Attendance System</div>
        <div className="sidebar-items">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => {
                
                if (item.id === 'dashboard') {
                  navigate("/dashboard");
                } else {
                  navigate("/" + item.id);
                }
                setCurrentPage(item.id);
              }}
            >
              {getIconForItem(item.id)} {item.label}
            </div>
          ))}
        </div>
      </div>
      <div className="content">
        {/* <div className="title">Automated Attendance Management System</div> */}
        <div className="page-content">
        {currentPage==='manage-student' && <ManageStudent/>}
        {currentPage==='manage-attendance' && <ManageAttendance/>}
        {currentPage==='contact-us' && <ContactUs/>}
        {currentPage==='search-student' && <SearchData/>}
        {currentPage==='sign-out' && <SignOut/>}
        {currentPage==='dashboard' &&<Dashboard/>}
        {currentPage==='configure-cameras' && <Camera/>}
         {currentPage==='run-face-recognition' && <Train/>}
        </div>
      </div>
    </div>
  );
};



export default Sidebar;
