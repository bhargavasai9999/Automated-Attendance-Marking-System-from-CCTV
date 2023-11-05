from facenet_pytorch import MTCNN, InceptionResnetV1
import torch
from torchvision import datasets
from torch.utils.data import DataLoader
from PIL import Image
import cv2
import time
import os
import psycopg2
from psycopg2 import Error
import datetime
# initializing MTCNN and InceptionResnetV1 
db_params = {
    'dbname': 'student',
    'user': 'postgres',
    'password': 'sting',
    'host': 'localhost',
    'port': '5432',
}
today_date = datetime.date.today()
def connect_to_database():
    try:
        conn = psycopg2.connect(**db_params)
        return conn
    except Error as e:
        print(f"Error connecting to the database: {e}")
        return None
def address():
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
            conn.close()
            return attendance_check_results
        except Exception as e:
            return f"Error checking attendance for today: {e}"
    else:
        return "Error connecting to the database"
mtcnn0 = MTCNN(image_size=160, margin=0, keep_all=False, min_face_size=40) # keep_all=False
mtcnn = MTCNN(image_size=160, margin=0, keep_all=True, min_face_size=40) # keep_all=True
resnet = InceptionResnetV1(pretrained='vggface2',classify=True,num_classes=3)
resnet.load_state_dict(torch.load('face_recognition_model.pth'))
resnet.eval()
dataset = datasets.ImageFolder('faces_cropped') # photos folder path 
idx_to_class = {i:c for c,i in dataset.class_to_idx.items()} # accessing names of peoples from folder names

def collate_fn(x):
    return x[0]

loader = DataLoader(dataset, collate_fn=collate_fn)

# name_list = [] # list of names corrospoing to cropped photos
# embedding_list = [] # list of embeding matrix after conversion from cropped faces to embedding matrix using resnet
check_attendance_for_today()
video_sources=address()
# for img, idx in loader:
#     face, prob = mtcnn0(img, return_prob=True) 
#     if face is not None and prob>0.92:
#         emb = resnet(face.unsqueeze(0)) 
#         embedding_list.append(emb.detach()) 
#         name_list.append(idx_to_class[idx])        

# # save data
# data = [embedding_list, name_list] 
# torch.save(data, 'data.pt') # saving data.pt file
load_data = torch.load('data.pt') 
embedding_list = load_data[0] 
name_list = load_data[1] 
def face_recog(video_source):
    cam = cv2.VideoCapture(0)
    results=[]
    while True:
        ret, frame = cam.read()
        if not ret:
            print("fail to grab frame, try again")
            break
        im=cv2.imwrite('reco.jpg',frame)    
        img = Image.fromarray(frame)
        img_cropped_list, prob_list = mtcnn(img, return_prob=True) 
        if img_cropped_list is not None:
            boxes, _ = mtcnn.detect(img)

            for i, prob in enumerate(prob_list):
                if prob>0.90:
                    emb = resnet(img_cropped_list[i].unsqueeze(0)).detach() 

                    dist_list = [] # list of matched distances, minimum distance is used to identify the person
                    for idx, emb_db in enumerate(embedding_list):
                        dist = torch.dist(emb,emb_db).item()
                        dist_list.append(dist)

                    min_dist = min(dist_list) # get minumum dist value
                    min_dist_idx = dist_list.index(min_dist) # get minumum dist index
                    name = name_list[min_dist_idx] # get name corrosponding to minimum dist
                    print(name,min_dist)
                    box = boxes[i]
                    original_frame = frame.copy() # storing copy of frame before drawing on it

                    if min_dist<200:

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
                                print(name)
                        else:
                            print("already captured")

                        cv2.putText(frame, name, (int(box[0]),int(box[1])), cv2.FONT_HERSHEY_COMPLEX, 0.5, (255, 255, 255), 1)

                    # frame = cv2.rectangle(frame, (box[0],box[1]) , (box[2],box[3]), (255,0,0), 2)

        cv2.imshow("IMG", frame)


        k = cv2.waitKey(1)
        if k%256==27: # ESC
            print('Esc pressed, closing...')
            break

        elif k%256==32: # space to save image
            print('Enter your name :')
            name = input()

            # create directory if not exists
            if not os.path.exists('photos/'+name):
                os.mkdir('photos/'+name)

            img_name = "photos/{}/{}.jpg".format(name, int(time.time()))
            cv2.imwrite(img_name, original_frame)
            print(" saved: {}".format(img_name))

    cam.release()
    cv2.destroyAllWindows()

face_recog(video_sources[0])