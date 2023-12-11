# Automated Attendance Marking System
# Objective
The main goal of our Automated Attendance System is to quickly and smoothly recognize people's faces in real-time and mark their attendance instantly. This means that as soon as someone walks in front of the camera, the system recognizes them and records their attendance without any delays. We want the system to work seamlessly, updating attendance information live on the screen so that teachers or event organizers can see who's present at any given moment. We're making sure the system reacts right away to changes, handles various situations like different lighting, and can manage a large number of people without slowing down. Our aim is to create a user-friendly solution that makes attendance tracking easy and efficient, especially in fast-paced environments like classrooms or events where time is of the essence.
# Overview
  This project is an automated attendance marking system with a React frontend and Flask API backend. Face recognition is implemented using facenet-pytorch, YOLOv8, Ultralytics, OpenCV, etc.

# Features
- User-friendly Interface:
React-based frontend with an intuitive design.
- Automated Face Recognition: 
Utilizing facenet-pytorch, YOLOv8, Ultralytics, OpenCV.
- Secure Data Storage:
PostgreSQL for storing attendance records securely.

# Frontend (React, HTML, CSS, JavaScript):
Install dependencies:
- clone the repository
- npm install
# Backend (Flask API, PostgreSQL)
Navigate to the backend directory:
#  For Windows
- python -m venv env
- .\env\Scripts\activate
# For macOS/Linux
- python3 -m venv env
- source env/bin/activate
- pip install -r requirements.txt
- Configure the database connection in config.py.
## Run the Flask application:
- cd backend && cd env
- python app.py
- Backend accessible at http://localhost:5000.
# Run the React server:
- npm start
- Access the application at http://localhost:3000.
## Start frontend and backend servers.
- cd folder-name
- npm start (both frontend and backend run concurrently)
Use the interface for attendance marking.
## Screenshots
![Screenshot (69)](https://github.com/bhargavasai9999/Automated-Attendance-Marking-System-from-CCTV/assets/85823759/23bd1e16-0574-494e-9056-3fd80c4db04e)
                                Login
![Screenshot (70)](https://github.com/bhargavasai9999/Automated-Attendance-Marking-System-from-CCTV/assets/85823759/f948fdfa-42ff-4da8-a5d8-47040011e8c7)
                              Dashboard
![Screenshot (71)](https://github.com/bhargavasai9999/Automated-Attendance-Marking-System-from-CCTV/assets/85823759/2626c3da-6fad-4fa3-ad5f-4835627fdde5)
![Screenshot (72)](https://github.com/bhargavasai9999/Automated-Attendance-Marking-System-from-CCTV/assets/85823759/1e8a189e-9ce7-4e1d-96d4-d2aa770383a0)
![Screenshot (73)](https://github.com/bhargavasai9999/Automated-Attendance-Marking-System-from-CCTV/assets/85823759/8389d143-d7f6-4ff8-bc3f-e1b32e388d66)
![Screenshot (74)](https://github.com/bhargavasai9999/Automated-Attendance-Marking-System-from-CCTV/assets/85823759/8868b2f8-b428-4cdd-9753-ae52dc10b005)
![Screenshot (75)](https://github.com/bhargavasai9999/Automated-Attendance-Marking-System-from-CCTV/assets/85823759/9692e306-1ad1-4500-8d01-ad498fa987e6)

# Deployment link
Open to view website http://65.1.220.178:3000.
# Login
- username: **admin**
- password: **admin**


# Other contributors...
- Sree Vyshnavi
# License
This project is licensed under the MIT License. Contributions welcome!
