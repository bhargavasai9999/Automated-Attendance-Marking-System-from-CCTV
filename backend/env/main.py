import wcamrecog as fp
from multiprocessing import Process
import psycopg2
from psycopg2 import Error

def connect_to_database(db_params):
    try:
        conn = psycopg2.connect(**db_params)
        if conn:
            cursor = conn.cursor()
            query = "SELECT camera_address FROM student_management.cameras"
            cursor.execute(query)
            addresses = [record[0] for record in cursor.fetchall()]
            cursor.close()
            conn.close()
            return addresses
    except Error as e:
        return f"Error connecting to the database: {e}"
processes = []

def main():
    db_params = {
        'dbname': 'student',
        'user': 'postgres',
        'password': 'sting',
        'host': 'localhost',
        'port': '5432',
    }
    
    video_sources = connect_to_database(db_params)
    
    if not video_sources:
        return "No cameras configured"
    print(video_sources)
    
    
    
    for video_source in video_sources:
        p = Process(target=fp.face_recog, args=(video_source,))
        p.start()
        processes.append(p)
    return processes
def stop_recog():
    for p in processes:
        if p.is_alive():
            p.join()
            processes.remove(p)

if __name__ == "__main__":
    main()
