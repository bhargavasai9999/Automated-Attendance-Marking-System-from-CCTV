## Automated Attendance Marking System
# Overview
  This project is an automated attendance marking system with a React frontend and Flask API backend. Face recognition is implemented using facenet-pytorch, YOLOv8, Ultralytics, OpenCV, etc.

# Features
# User-friendly Interface:
React-based frontend with an intuitive design.
# Automated Face Recognition: 
Utilizing facenet-pytorch, YOLOv8, Ultralytics, OpenCV.
# Secure Data Storage:
PostgreSQL for storing attendance records securely.

## Frontend (React, HTML, CSS, JavaScript)
# Install dependencies:
clone the repository
npm install
## Backend (Flask API, PostgreSQL)
Navigate to the backend directory:
# For Windows
python -m venv env
.\env\Scripts\activate
# For macOS/Linux
python3 -m venv env
source env/bin/activate

- pip install -r requirements.txt
- Configure the database connection in config.py.
## Run the Flask application:
cd backend && cd env
python app.py
Backend accessible at http://localhost:5000.
# Run the React server:
npm start
Access the application at http://localhost:3000/
## Start frontend and backend servers.
- cd folder-name
- npm start (both frontend and backend run concurrently)
Use the interface for attendance marking.
Contributors
Other contributors...
- Sree Vyshnavi
License
This project is licensed under the MIT License. Contributions welcome!
