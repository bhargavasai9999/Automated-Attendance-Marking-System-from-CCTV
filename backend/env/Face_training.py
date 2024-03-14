import torch
from facenet_pytorch import InceptionResnetV1
from torchvision import datasets
from torch.utils.data import DataLoader
import torchvision.transforms as transforms
import gc

def train_data():
    resnet = InceptionResnetV1(pretrained='vggface2',classify=True,num_classes=3)
    resnet.load_state_dict(torch.load('face_recognition_model.pth'))
    resnet.eval()
    dataset = datasets.ImageFolder('faces_cropped') # photos folder path 
    idx_to_class = {i:c for c,i in dataset.class_to_idx.items()} # accessing names of peoples from folder names
    def collate_fn(x):
        return x[0]

    loader = DataLoader(dataset, collate_fn=collate_fn)
    embedding_list=[]
    name_list=[]
    transform=transforms.Compose([transforms.PILToTensor()])
    print("model traing started")
    try:
        for img,idx in loader:
            face=transform(img)
            face=face.to(torch.float32)
            if face is not None:
                emb = resnet(face.unsqueeze(0)) 
                embedding_list.append(emb.detach()) 
                name_list.append(idx_to_class[idx])
        data = [embedding_list, name_list]
    except:
        print("Error in images Training try to re-Initiate process with proper Images")
        return
    finally:
        print("training model completed")
        torch.save(data, 'data.pt')
        return ("model trained and saved in local")

train_data()
gc.collect()