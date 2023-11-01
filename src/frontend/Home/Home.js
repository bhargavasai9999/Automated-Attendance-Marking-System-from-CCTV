import React from 'react'
import './home.css'
import logo from './gprec-removebg-preview.png'
const Home = () => {
  return (

  
<div>

    <header>
       
        <nav> 
            <img src={logo} alt="Your Startup Logo"/>
            
                <ul> 
                    <li><a href="aboutus.html">About Us</a></li>
                   
                    <li><a href="contact.html">Contact</a></li>
                    <li><a href="login.html" class="btn-login">Login</a></li>
                 
                </ul>
         
        </nav>
        <h1>Automated Attendance System</h1>
       
      
    </header>

    <section class="hero">
        <div class="container">
            <h2>Welcome to Automated Attendance System</h2>
            <p>We provide automated attendance for the students using cctv camera .</p>
            <a href='/addstudent' class="btn">Get Started</a>
        </div>
    </section>
   


    <footer>
        <div class="container">
            <p>&copy; 2023 batch , CST-A12. All Rights Reserved.</p>
        </div>
    </footer>

</div>



  )
}
export default Home;