import React from 'react'
import Sidebar  from './frontend/Sidebar/Sidebar'
import { Route, Routes,BrowserRouter as Router, Navigate, useNavigate } from 'react-router-dom';
import StudentRegistrationForm from './frontend/RegistrationForm/StudentRegistrationForm'
import EditStudentData from './frontend/RegistrationForm/EditStudentData'
import DeleteStudent from './frontend/RegistrationForm/DeleteStudent'
import ManageStudent from './frontend/ManageStudent/ManageStudent';
import ManageAttendance from './frontend/ManageAttendance/ManageAttendance';
import ContactUs from './frontend/ContactUs/ContactUs';
import SignOut from './frontend/SignOut/SignOut';
import AttendanceReport from './frontend/ViewAttendance/AttendanceReport'
import StudentAttendance from './frontend/ViewAttendance/StudentAttendance'
import SearchData from './frontend/SearchStudent/SearchData';
import Camera from './frontend/cameras/Camera'
import Login from './frontend/Authentication/Login';
import TrainImages from './frontend/RegistrationForm/TrainImages';


const  App = () => {
  const items=localStorage.getItem('login')
  const navigate=useNavigate()
  return (
    <div>
      <Routes>
      <Route path='/login' exact element={<Login/>}/>
      <Route path='/*' element={<Navigate to='/login'/>}/>
    <Route path='/tain' element={<TrainImages/>}/>
    
      <Route path='/dashboard'   element={<Sidebar/>}/>

        <Route path='/manage-student/addstudent' element={<StudentRegistrationForm/>}/>
        <Route path='/manage-student/editstudent' element={<EditStudentData/>}/>
        <Route path='/manage-student/deletestudent' element={<DeleteStudent/>}/>
        <Route path="/manage-attendance/classattendance" element={<AttendanceReport/>}/>
        <Route path="/manage-attendance/studentattendance" element={<StudentAttendance/>}/>
        <Route path="/manage-student" element={<Sidebar/>}/>
        <Route path='/search-student' element={<Sidebar/>}/>
        <Route path='/manage-attendance/search-student' element={<SearchData/>}/>

        <Route path="/manage-attendance" element={<Sidebar/>}/>
        <Route path="/contact-us" element={<Sidebar/>}/>
        <Route path="/sign-out" element={<Sidebar/>}/>
        <Route path='/run-face-recognition' element={<Sidebar/>}/>
        <Route path="/configure-cameras" element={<Sidebar/>}/>
    
      </Routes>
      </div>
  )
}
export default App;