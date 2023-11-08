// SearchData.js

import React, { useState } from 'react';
import axios from 'axios';
import './SearchData.css'; // Import the CSS file

const SearchData = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const convertDateToFormattedString = (originalDate) => {
    const dateObject = new Date(originalDate);

    const day = dateObject.getUTCDate();
    const month = dateObject.getUTCMonth() + 1; 
    const year = dateObject.getUTCFullYear();

    const formattedDay = (day < 10) ? `0${day}` : day;
    const formattedMonth = (month < 10) ? `0${month}` : month;

    return `${year}-${formattedMonth}-${formattedDay}`;
  }
  const handleSearch = () => {
    setIsLoading(true);

    axios.get("http://localhost:5000/student_attendance/"+searchQuery).then(res=>{
      console.log(res.message)
    if(res.data.message || res.message){
      alert(res.data.message+" or check your internet connection")
    }
    else{
      setSearchResults(res.data)
    }
      
      
    })
    setTimeout(() => {
     

      
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="search-data-container">
            <h3 style={{marginTop:'0px'}}>Search student details</h3>

      <input
        type="text"
        placeholder="Enter Student ID"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <button onClick={handleSearch} disabled={isLoading} className="fetch-button">
        {isLoading ? 'Fetching...' : 'Search Data'}
      </button>
      {searchResults && (
        <div className="search-results">
          <h2 className="results-heading">Search Results:</h2>
          <p> <img src={searchResults.profile_photo} style={{borderRadius:"5px"}} placeholder='profile image'/></p>
          <p className='result-item'> Full Name:<span style={{color:'red',paddingLeft:'10px'}}> {searchResults.first_name} {searchResults.last_name}</span> </p>
          <p className='result-item'>Class :<span style={{color:'red',paddingLeft:'10px'}}>{searchResults.class_name}</span> </p>
          <p className='result-item'>Date of Birth : <span style={{color:'red',paddingLeft:'10px'}}>{convertDateToFormattedString(searchResults.date_of_birth)}</span></p>
          <p className='result-item'>Guardian Name: <span style={{color:'red',paddingLeft:'10px'}}>{searchResults.guardian_name} </span></p>
          <p className='result-item'>Guardian Contact: <span style={{color:'red',paddingLeft:'10px'}}> {searchResults.guardian_contact}</span> </p>
        
          <p className='result-item'>Address: <span style={{color:'red',paddingLeft:'10px'}}>{searchResults.address}</span></p>
          <p className='result-item'>Attendance Percentage: <span style={{color:'red',paddingLeft:'10px'}}>{searchResults.attendance_percentage} %</span></p>


        
        </div>
      )}
    </div>
  );
};

export default SearchData;
