// ContactUs.js

import React from 'react';
import './ContactUs.css'; // Import the CSS file
const email = 'bhargavasai.rayalla@gmail.com';

const openMailApp = () => {
  window.location.href = `mailto:${email}`;
};
const ContactUs = () => {
  return (
    <div>
      <h2>Contact Details</h2>
    <div className="contact-us-container">
      <h2>G Pulla Reddy Engineering College</h2>
      <p>
        Address: <span className="contact-detail">Kurnool,Andhra Pradesh-518007</span>
      </p>
      <p>
        Phone: <span className="contact-detail">+91 9010189485</span>
      </p>
      <p>
        Email: <a className="contact-detail" href={`mailto:${email}`} onClick={openMailApp}>bhargavasai.rayalla@gmail.com</a>
      </p>
    </div>
    </div>
  );
};

export default ContactUs;
