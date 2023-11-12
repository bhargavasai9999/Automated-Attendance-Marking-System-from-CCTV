import cv2
from ultralytics import YOLO
import supervision as sv
import numpy as np
import subprocess
from multiprocessing import Process
import datetime
from facenet_pytorch import InceptionResnetV1,fixed_image_standardization
import torch
from torchvision import datasets
import torchvision.transforms as transforms
from torch.utils.data import DataLoader
from PIL import Image
from torchvision import datasets
import psycopg2
from psycopg2 import Error
import time

device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
dataset = datasets.ImageFolder('faces_cropped')  # photos folder path
idx_to_class = {i: c for c, i in dataset.class_to_idx.items()}
resnet = InceptionResnetV1(pretrained='vggface2', classify=True, num_classes=len(dataset.class_to_idx)).to(device)
resnet.load_state_dict(torch.load("face_recognition_model.pth"))
resnet.eval()
model = YOLO("yolov8n-face.pt")
today_date = datetime.date.today()

# Load Data of embeddings
load_data = torch.load('data.pt')
embedding_list = load_data[0]
name_list = load_data[1]
results=[]

def beep():
    subprocess.call(["afplay", "/System/Library/Sounds/Glass.aiff"])


def detect_objects(video_source):
    load_data = torch.load('data.pt')
    embedding_list = load_data[0]
    name_list = load_data[1]
    transform = transforms.Compose([transforms.ToPILImage()])

    fps_start_time = time.time()
    fps = 0
    for result in model.predict(source=video_source,
                                device=device,
                                cache=False,
                                max_det=60,
                                stream=True,
                                agnostic_nms=True):
        frame = result.orig_img
        detections = sv.Detections.from_ultralytics(result)
        for coordinates in detections:
            if coordinates[2] > 0.60:
                (x, y, w, h) = coordinates[0].astype('int')
                image = frame[y:h, x:w]
                image = cv2.resize(image, (160, 160), interpolation=cv2.INTER_LANCZOS4)
                transform = transforms.Compose([
                    transforms.ToPILImage(),
                    transforms.ToTensor(),
                    fixed_image_standardization
                ])
                image = transform(image).unsqueeze(0).to(device)
                emb = resnet(image).squeeze()
                dist = torch.cdist(emb.unsqueeze(0), torch.stack(embedding_list)).squeeze()
                min_dist, min_dist_idx = torch.min(dist, dim=0)
                if min_dist < 500:
                    name = name_list[min_dist_idx.item()]
                    print(name, min_dist.item())
                    if name not in results:
                        results.append(name)
                        conn=connect_to_database()
                        if conn:
                            cursor = conn.cursor()
                            cursor.execute(
                            """
                            UPDATE student_management.attendance
                            SET status = %s, reason = %s
                            WHERE student_id = %s AND attendance_date = %s
                            """,
                            ("P", "captured by camera", name, today_date)
                            )
                            conn.commit()
                            conn.close()
                            print(name,"captured")
                        else:
                            print("already captured")
                else:
                    name = "Unknown"
                    print(name)
                fps_end_time = time.time()
                fps_diff_time = fps_end_time - fps_start_time
                fps = 1 / fps_diff_time
                fps_start_time = fps_end_time
                fps_text = "INFERENCE-FPS:{:.0f}".format(fps)
                cv2.putText(frame, fps_text, (5, 30), cv2.FONT_HERSHEY_COMPLEX, 0.5, (255, 255, 255), 1)
                cv2.putText(frame, name, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                cv2.rectangle(frame, (x, y), (w, h), (0, 255, 0), 2)

                cv2.imshow("Face Recognition working", frame)

                if (cv2.waitKey(30) == 27):
                    break

    cv2.destroyAllWindows()


def train_data():
    
    dataset = datasets.ImageFolder('faces_cropped')  # photos folder path
    idx_to_class = {i: c for c, i in dataset.class_to_idx.items()}
    resnet = InceptionResnetV1(pretrained='vggface2', classify=True, num_classes=len(dataset.class_to_idx)).to(device)
    resnet.eval()# accessing names of peoples from folder names
    transform = transforms.Compose([transforms.PILToTensor()])
    embedding_list = []
    name_list = []
    print("model training started")
    for img, idx in DataLoader(dataset, collate_fn=lambda x: x[0]):
        face = transform(img).to(torch.float32)
        face = face.to(device)
        if face is not None:
            emb = resnet(face.unsqueeze(0))
            embedding_list.append(emb.detach())
            name_list.append(idx_to_class[idx])
    data = [embedding_list, name_list]
    print(embedding_list)
    torch.save(data, 'data.pt')
    print("model trained and saved in local")
    return "completed"


def connect_to_database():
    db_params = {
        'dbname': 'postgres',
        'user': 'postgres',
        'password': 'postgres',
        'host': 'database-1.c2beljlrxbik.ap-south-1.rds.amazonaws.com',
        'port': '5430',
    }
    try:
        conn = psycopg2.connect(**db_params)
        return conn
    except Error as e:
        print(f"Error connecting to the database: {e}")
        return None


def address():
    conn = connect_to_database()
    try:
        if conn:
            cursor = conn.cursor()
            query = "SELECT camera_address FROM student_management.cameras"
            cursor.execute(query)
            addresses = [record[0] for record in cursor.fetchall()]
            cursor.close()
            return addresses
    except Error as e:
        return f"Error connecting to the database: {e}"
    finally:
        if conn:
            conn.close()


def check_attendance_for_today():
    conn = connect_to_database()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT student_id FROM student_management.students"
            )
            student_ids = [row[0] for row in cursor.fetchall()]
            attendance_check_results = {}
            for student_id in student_ids:
                cursor.execute(
                    "SELECT COUNT(*) FROM student_management.attendance WHERE student_id = %s AND attendance_date = %s",
                    (student_id, today_date)
                )
                result = cursor.fetchone()
                has_attendance = result[0] > 0
                attendance_check_results[student_id] = has_attendance
                # If no attendance record for today, insert an absent record
                if not has_attendance:
                    cursor.execute(
                        "INSERT INTO student_management.attendance (student_id, attendance_date, status) VALUES (%s, %s, %s)",
                        (student_id, today_date, 'A')
                    )
            conn.commit()
        except Exception as e:
            print(f"Error checking attendance for today: {e}")
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
            return attendance_check_results
    else:
        return "Error connecting to the database"


def main():
    video_sources = ["0"]
    check_attendance_for_today()
    # train_data()
    processes = []
    for video_source in video_sources:
        p = Process(target=detect_objects, args=(video_source,))
        p.start()
        processes.append(p)
    for p in processes:
        if not p.is_alive():
            p.join()
            processes.remove(p)


if __name__ == "__main__":
    main()
