from flask import Flask, request, jsonify
import psycopg2
from psycopg2 import Error
import subprocess
from flask_cors import CORS
from datetime import datetime
from flask import Response

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
script_process=None
# PostgreSQL database connection parameters
db_params = {
    'dbname': 'postgres',
    'user': 'postgres',
    'password': 'postgres',
    'host': 'database-1.c2beljlrxbik.ap-south-1.rds.amazonaws.com',
    'port': '5430',
}

def connect_to_database():
    try:
        conn = psycopg2.connect(**db_params)
        return conn
    except Error as e:
        print(f"Error connecting to the database: {e}")
        return None

@app.route('/addstudents', methods=['POST'])
def students():
    if request.method == 'POST':
        data = request.json
        
        if not data:
            return "Invalid data. Please provide data in JSON format."

        # Extract student data from the JSON payload
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        date_of_birth = data.get('date_of_birth')
        address = data.get('address')
        guardian_name = data.get('guardian_name')
        class_name = data.get('classname')
        image=data.get("profile_photo")
        
        student_id=data.get('student_id')
        guardian_contact = data.get('guardian_contact')
        enrollment_date = data.get('enrollment_date')
        print(first_name,last_name,date_of_birth,address,guardian_contact,guardian_name,class_name,student_id,enrollment_date,image)
        
        if not all([first_name, last_name, enrollment_date,class_name,image]):
            return "Missing required data. Please provide first_name, last_name,class_name,image and enrollment_date.", 400

        conn = connect_to_database()
        if conn:
            try:
                cursor = conn.cursor()
                values=(student_id,first_name, last_name, enrollment_date, class_name, date_of_birth, address, guardian_name,guardian_contact,image)

                # Insert a new student record into the database
                cursor.execute(
                    "INSERT INTO student_management.students (student_id,first_name, last_name, enrollment_date,class,date_of_birth,address, guardian_name, guardian_contact,image) "
                    "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING student_id",
                values
                )
                student_id = cursor.fetchone()[0]
                conn.commit()
                conn.close()
                return f"Student with ID {student_id} has been added."
            except Exception as e:
                conn.rollback()
                print(e)
                return f"Error adding the student: {e}"

@app.route('/students', methods=['GET'])
def get_students_by_class():
    class_name = request.args.get('class_name')
    conn = connect_to_database()
    if not class_name and conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM student_management.students")
        students = cursor.fetchall()
        conn.close()
        return jsonify(students)

    elif conn:
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM student_management.students WHERE class = %s", (class_name,))
            students = cursor.fetchall()
            conn.close()
            return jsonify(students)
        except Exception as e:
            return f"Error fetching students by class: {e}"
    else:
        return "Error connecting to the database"


    
@app.route('/update_student/<string:student_id>', methods=['PUT'])
def update_student(student_id):
    data = request.get_json()
    
    if not data:
        return "Invalid data. Please provide data in JSON format."

    conn = connect_to_database()
    if conn:
        try:
            cursor = conn.cursor()

            # Construct the SQL query for updating the student's details
            update_query = """
                UPDATE student_management.students
                SET
                    first_name = %s,
                    last_name = %s,
                    date_of_birth = %s,
                    address = %s,
                    guardian_name = %s,
                    guardian_contact = %s,
                    enrollment_date = %s,
                    class=%s
                WHERE student_id = %s;
            """
            
            cursor.execute(update_query, (
                data.get('first_name'),
                data.get('last_name'),
                data.get('date_of_birth'),
                data.get('address'),
                data.get('guardian_name'),
                data.get('guardian_contact'),
                data.get('enrollment_date'),
                data.get('class_name'),
                student_id
            ))

            conn.commit()
            conn.close()
            return f"Student with ID {student_id} has been updated."
        except Exception as e:
            conn.rollback()
            return f"Error updating the student: {e}"
    else:
        return "Error connecting to the database"

@app.route('/students/<string:student_id>', methods=['GET'])
def get_student(student_id):
    try:
        conn = connect_to_database()
        cursor = conn.cursor()

        # Execute a SQL query to fetch the student by student_id
        cursor.execute("SELECT * FROM student_management.students WHERE student_id = %s", (student_id,))
        student = cursor.fetchone()

        if student:
            # Convert the result to a dictionary for JSON response
            student_data = {
                'student_id': student[0],
                'first_name': student[1],
                'last_name': student[2],
                'date_of_birth': student[3],
                'address': student[4],
                'guardian_name': student[5],
                'guardian_contact': student[6],
                'enrollment_date': student[7],
                'class_name':student[8],
                'profile_photo':student[9]
            }
            return jsonify(student_data)
        else:
            return jsonify({'message': 'Student not found'})

    except (Exception, psycopg2.Error) as error:
        return jsonify({'message': f'Error fetching student: {error}'})

    finally:
        if conn:
            cursor.close()
            conn.close()
@app.route('/students/<string:student_id>', methods=['DELETE'])
def delete_student_by_id(student_id):
    conn = connect_to_database()
    if conn:
        try:
            cursor = conn.cursor()
            
            # Delete the student's attendance data
            cursor.execute(
                "DELETE FROM student_management.attendance WHERE student_id = %s",
                (student_id,)
            )
            
            # Delete the student from the students table
            cursor.execute(
                "DELETE FROM student_management.students WHERE student_id = %s",
                (student_id,)
            )
            
            conn.commit()
            conn.close()
            return f"Student with ID {student_id} and their attendance data have been deleted."
        except Exception as e:
            conn.rollback()
            return f"Error deleting the student and their attendance data: {e}"
    else:
        return "Error connecting to the database"



@app.route('/attendance', methods=['GET'])
def get_attendance_by_class():
    class_name = request.args.get('class_name')
    date = request.args.get('date')

    if not class_name or not date:
        return jsonify({'error': 'Please select class and date'})

    conn = connect_to_database()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT a.*
                FROM student_management.attendance AS a
                JOIN student_management.students AS s ON a.student_id = s.student_id
                WHERE s.class = %s AND a.attendance_date = %s ORDER BY s.student_id
                """,
                (class_name, date)
            )
            attendance_records = cursor.fetchall()
            conn.close()

            if not attendance_records:
                return jsonify({'message': 'No attendance records found for the given parameters.'})

            return jsonify(attendance_records)
        except Exception as e:
            return jsonify({'error': f"Error fetching attendance records by class and date: {e}"})
    else:
        return jsonify({'error': 'Error connecting to the database'})


@app.route('/attendance/<string:student_id>', methods=['GET'])
def get_attendance_by_student_id(student_id):
    conn = connect_to_database()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute(
             "SELECT * FROM student_management.attendance WHERE student_id = %s ORDER BY attendance_date DESC",
             (student_id,)
            )

            attendance_records = cursor.fetchall()
            conn.close()
            return jsonify(attendance_records)
        except Exception as e:
            return f"Error fetching attendance records by student ID: {e}"
    else:
        return "Error connecting to the database"

@app.route('/attendance/<string:student_id>', methods=['PUT'])
def update_attendance_by_student_id(student_id):
    if not request.json or '2' not in request.json or 'status' not in request.json:
        return "Invalid data. Please provide data in JSON format with 'attendance_date' and 'status' fields.", 400
    print(request.json)
    attendance_date = request.json['2']
    parsed_date = datetime.strptime(attendance_date, '%a, %d %b %Y %H:%M:%S %Z')
    formatted_date = parsed_date.strftime('%Y-%m-%d')
    status = request.json['status']
    reason = request.json.get('reason')  # 'reason' is optional
    

    conn = connect_to_database()
    if conn:
        try:
            cursor = conn.cursor()
            
            cursor.execute(
                """
                UPDATE student_management.attendance
                SET status = %s, reason = %s
                WHERE student_id = %s AND attendance_date = %s
                """,
                (status, reason, student_id, formatted_date)
            )
            
            conn.commit()
            conn.close()
            return f"Attendance data updated for student with ID {student_id} on {attendance_date}.", 200
        except Exception as e:
            conn.rollback()
            return f"Error updating attendance data: {e}"
    else:
        return "Error connecting to the database"
    
@app.route('/student_attendance/<string:student_id>', methods=['GET'])

def get_student_attendance(student_id):
    conn = connect_to_database()
    if conn:
        try:
            cursor = conn.cursor()

            # Fetch student data
            cursor.execute(
                """
                SELECT student_id, first_name, last_name, date_of_birth, address, guardian_name, guardian_contact, enrollment_date,class,image
                FROM student_management.students
                WHERE student_id = %s
                """,
                (student_id,)
            )
            student_data = cursor.fetchone()

            if not student_data:
                return jsonify({'message': 'Student not found'}) # 404 Not Found

            # Fetch attendance data
            cursor.execute(
                """
                SELECT COUNT(*) AS total_days,
                       COUNT(CASE WHEN status = 'P' THEN 1 ELSE NULL END) AS present_days
                FROM student_management.attendance
                WHERE student_id = %s
                """,
                (student_id,)
            )
            attendance_summary = cursor.fetchone()
            print(attendance_summary)
            # Calculate attendance percentage
            total_days = attendance_summary[0]
            present_days = attendance_summary[1]
            attendance_percentage = (present_days / total_days) * 100 if total_days > 0 else 0

            # Combine student data and attendance percentage
            result = {
                'student_id': student_data[0],
                'first_name': student_data[1],
                'last_name': student_data[2],
                'date_of_birth': student_data[3],
                'address': student_data[4],
                'guardian_name': student_data[5],
                'guardian_contact': student_data[6],
                'enrollment_date': student_data[7],
                'class_name':student_data[8],
                'profile_photo':student_data[9],
                
                'attendance_percentage': attendance_percentage
            }

            return jsonify(result)

        except Exception as e:
            return jsonify({'error': f"Error fetching student attendance data: {e}"})# 500 Internal Server Error
        finally:
            conn.close()




# API route to fetch student details and attendance status for the present date
@app.route('/attendance_today', methods=['GET'])
def get_attendance_today():
    conn = connect_to_database()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT s.student_id, s.first_name, s.last_name, a.status,s.class
                FROM student_management.students AS s
                LEFT JOIN student_management.attendance AS a
                ON s.student_id = a.student_id
                AND a.attendance_date = current_date
                """
            )
            student_data = cursor.fetchall()

            result = []
            for record in student_data:
                student_id, first_name, last_name, status,class_name = record
                result.append({
                    'student_id': student_id,
                    'first_name': first_name,
                    'last_name': last_name,
                    'attendance_status': status,
                    'class_name':class_name
                })

            return jsonify(result)

        except Exception as e:
            return jsonify({'error': f"Error fetching student attendance data: {e}"}), 500  # 500 Internal Server Error
        finally:
            conn.close()

    else:
        return jsonify({'error': 'Error connecting to the database'}), 500  # 500 Internal Server Error

# API route to fetch student details, including attendance status
@app.route('/student_details', methods=['GET'])
def get_student_details():
    conn = connect_to_database()
    if conn:
        try:
            cursor = conn.cursor()

            # Fetch all student details including image
            cursor.execute(
                """
                SELECT s.*, a.status AS present_status
                FROM student_management.students AS s
                LEFT JOIN student_management.attendance AS a ON s.student_id = a.student_id
                WHERE a.attendance_date = CURRENT_DATE ORDER BY s.student_id
                """
            )
            student_details = cursor.fetchall()

            if not student_details:
                return jsonify({'message': 'No students found for the present date'})  # 404 Not Found

            result = []

            for student in student_details:
                student_data = {
                    'student_id': student[0],
                    'first_name': student[1],
                    'last_name': student[2],
                    'date_of_birth': student[3],
                    'address': student[4],
                    'guardian_name': student[5],
                    'guardian_contact': student[6],
                    'enrollment_date': student[7],
                    'image': student[9],
                    'class': student[8],
                    'attendance_status': student[10]
                }
                result.append(student_data)
            return jsonify(result)

        except Exception as e:
            return jsonify({'message': f"Error fetching student details: {e}"})  # 500 Internal Server Error
        finally:
            conn.close()

    else:
        return jsonify({'error': 'Error connecting to the database'})  # 500 Internal Server Error

# API route to update attendance status
@app.route('/update_attendance_today', methods=['PUT'])
def update_attendance():
    student_id = request.json.get('student_id')
    new_status = request.json.get('attendance_status')
    print(student_id,new_status)

    if not student_id or new_status not in ['P', 'A']:
        return jsonify({'error': 'Invalid input data'})  # 400 Bad Request

    conn = connect_to_database()
    if conn:
        try:
            cursor = conn.cursor()

            # Check if the record exists for the current date
            cursor.execute(
                """
                SELECT 1
                FROM student_management.attendance
                WHERE student_id = %s AND attendance_date = CURRENT_DATE
                """,
                (student_id,)
            )
            record_exists = cursor.fetchone()

            if record_exists:
                print(record_exists)
                # Update the existing record
                cursor.execute(
                    """
                    UPDATE student_management.attendance
                    SET status = %s
                    WHERE student_id = %s AND attendance_date = CURRENT_DATE
                    """,
                    (new_status, student_id)
                )
            else:
                # Insert a new record for the current date
                cursor.execute(
                    """
                    INSERT INTO student_management.attendance (student_id, status, attendance_date)
                    VALUES (%s, %s, CURRENT_DATE)
                    """,
                    (student_id, new_status)
                )

            conn.commit()
            return jsonify({'message': 'Attendance status updated successfully'})

        except Exception as e:
            return jsonify({'error': f"Error updating attendance status: {e}"})  # 500 Internal Server Error
        finally:
            conn.close()

    else:
        return jsonify({'error': 'Error connecting to the database'})  # 500 Internal Server Error
    
    
    
    
    
@app.route('/start_script', methods=['GET'])
def start_script():
    global script_process
    if script_process is None:
        script_process = subprocess.Popen(['python', 'wcamrecog.py'])
        
        return Response("face recognisation started ... wait for pop up", mimetype='text/plain')
    elif script_process is not None:
        return Response("Face recognition is already running.", mimetype='text/plain')
@app.route('/train_images', methods=['GET'])
def train_images():
    global script_process
    if True:
        script_process = subprocess.Popen(['python', 'video.py'])
        
        return Response("Taking training images ...wait for pop up", mimetype='text/plain')
    else:
        return Response("Internal Error", mimetype='text/plain')
@app.route('/stop_script', methods=['GET'])
def stop_script():
    global script_process
    if script_process:
        script_process.terminate()  # Terminate the subprocess
        script_process = None
        return Response("Face Recognition stopped.", mimetype='text/plain')
    else:
        return "done"
@app.route('/train_data',methods=['GET'])
def face():
    # Execute the Python script when the button is clicked
    Response("file opened")
    subprocess.Popen(['python', 'finetuned_model.py'])

    subprocess.Popen(['python', 'Face_training.py'])
    return "Training model is running...wait for a while and procedd to recognition"
@app.route('/add_camera', methods=['POST'])
def add_camera():
    db_connection=connect_to_database()
    db_cursor = db_connection.cursor()
    data = request.get_json()
    camera_id = data.get('camera_id')
    camera_name = data['camera_name']
    camera_address = data['camera_address']

    try:
        # Check if the camera_id already exists in the 'cameras' table
        if camera_id is not None:
            check_query = "SELECT camera_id FROM student_management.cameras WHERE camera_id = %s"
            db_cursor.execute(check_query, (camera_id,))
            existing_id = db_cursor.fetchone()
            if existing_id:
                return ({'message':'Camera with the same camera_id already exists'})

        # Insert the camera data into the 'cameras' table
        if camera_id is not None:
            insert_query = "INSERT INTO student_management.cameras (camera_id, camera_name, camera_address) VALUES (%s, %s, %s)"
            db_cursor.execute(insert_query, (camera_id, camera_name, camera_address))
        else:
            insert_query = "INSERT INTO student_management.cameras (camera_name, camera_address) VALUES (%s, %s)"
            db_cursor.execute(insert_query, (camera_name, camera_address))
        
        db_connection.commit()

        return jsonify({'message': 'Camera added successfully'})

    except Exception as e:
        return jsonify({'message': str(e)})



# PostgreSQL database configuration



@app.route('/delete_camera', methods=['POST'])
def delete_camera():
    db_connection=connect_to_database()
    db_cursor = db_connection.cursor()
    data = request.get_json()
    camera_id = data.get('camera_id')

    try:
        if camera_id is not None:
            # Check if the camera exists before deleting it
            check_query = "SELECT camera_id FROM student_management.cameras WHERE camera_id = %s"
            db_cursor.execute(check_query, (camera_id,))
            existing_id = db_cursor.fetchone()
            if existing_id is None:
                raise Exception('Camera with the specified camera_id does not exist')

            # Delete the camera from the 'cameras' table
            delete_query = "DELETE FROM student_management.cameras WHERE camera_id = %s"
            db_cursor.execute(delete_query, (camera_id,))
            db_connection.commit()

            return jsonify({'message': 'Camera deleted successfully'})
        else:
            raise Exception('camera_id is missing in the request')

    except Exception as e:
        return jsonify({'error': str(e)})



@app.route('/get_camera', methods=['GET'])
def get_all_cameras():
    try:
        db_connection=connect_to_database()
        db_cursor = db_connection.cursor()
        # Retrieve all camera records from the 'cameras' table
        query = "SELECT * FROM student_management.cameras ORDER BY camera_id"
        db_cursor.execute(query)
        cameras = db_cursor.fetchall()

        # Create a list of dictionaries to represent the camera records
        camera_list = [{'camera_id': camera[0], 'camera_name': camera[1], 'camera_address': camera[2]} for camera in cameras]

        return jsonify(camera_list)

    except Exception as e:
        return jsonify({'error': str(e)})




@app.route('/update_camera', methods=['POST'])
def update_camera():
    db_connection=connect_to_database()
    db_cursor = db_connection.cursor()
    data = request.get_json()
    camera_id = data.get('camera_id')
    new_camera_name = data.get('camera_name')
    new_camera_address = data.get('camera_address')

    try:
        if camera_id is not None:
            # Check if the camera exists before updating it
            check_query = "SELECT camera_id FROM student_management.cameras WHERE camera_id = %s"
            db_cursor.execute(check_query, (camera_id,))
            existing_id = db_cursor.fetchone()
            if existing_id is None:
                raise Exception('Camera with the specified camera_id does not exist')

            # Update the camera details in the 'cameras' table
            update_query = "UPDATE student_management.cameras SET camera_name = %s, camera_address = %s WHERE camera_id = %s"
            db_cursor.execute(update_query, (new_camera_name, new_camera_address, camera_id))
            db_connection.commit()

            return jsonify({'message': 'Camera details updated successfully'})
        else:
            raise Exception('camera_id is missing in the request')

    except Exception as e:
        return jsonify({'error': str(e)})
    
@app.route('/get_camera_addresses', methods=['GET'])
def get_camera_addresses():
    try:
        db_connection=connect_to_database()
        db_cursor = db_connection.cursor()

        # Retrieve all camera addresses from the 'cameras' table
        query = "SELECT camera_address FROM student_management.cameras"
        db_cursor.execute(query)
        addresses = [record[0] for record in db_cursor.fetchall()]

        return addresses

    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(host="0.0.0.0",port=80)





