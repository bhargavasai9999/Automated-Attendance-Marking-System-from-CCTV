from facenet_pytorch import MTCNN, InceptionResnetV1, fixed_image_standardization, training
import torch
from torch.utils.data import DataLoader, SubsetRandomSampler
from torch import optim
from torch.optim.lr_scheduler import MultiStepLR
from torch.utils.tensorboard import SummaryWriter
from torchvision import datasets, transforms
import numpy as np 
import os
from flask import Flask, Response

data_dir = 'faces'
batch_size = 50
epochs = 40
workers = 0 if os.name == 'nt' else 8
device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
print('Running on device: {}'.format(device))
def train_images():
    mtcnn = MTCNN(
        image_size=160, margin=0, min_face_size=20,
        thresholds=[0.6, 0.7, 0.7], factor=0.709, post_process=False,
        device=device
    )

    dataset = datasets.ImageFolder(data_dir, transform=transforms.Resize((512, 512)))
    dataset.samples = [
        (p, p.replace(data_dir, data_dir + '_cropped'))
            for p, _ in dataset.samples
    ]

    loader = DataLoader(
        dataset,
        num_workers=workers,
        batch_size=batch_size,
        collate_fn=training.collate_pil
    )

    for i, (x, y) in enumerate(loader):
        mtcnn(x, save_path=y)
        print('\rBatch {} of {}'.format(i + 1, len(loader)), end='')

    del mtcnn


    resnet = InceptionResnetV1(
        classify=True,
        pretrained='vggface2',
        num_classes=len(dataset.class_to_idx)
    ).to(device)
    optimizer = optim.Adam(resnet.parameters(), lr=0.001)
    scheduler = MultiStepLR(optimizer, [5, 10])

    trans = transforms.Compose([
        np.float32,
        transforms.ToTensor(),
        fixed_image_standardization
    ])
    dataset = datasets.ImageFolder(data_dir + '_cropped', transform=trans)
    img_inds = np.arange(len(dataset))
    np.random.shuffle(img_inds)
    train_inds = img_inds[:int(0.8 * len(img_inds))]
    val_inds = img_inds[int(0.8 * len(img_inds)):]


    train_loader = DataLoader(
        dataset,
        num_workers=workers,
        batch_size=batch_size,
        sampler=SubsetRandomSampler(train_inds)
    )
    val_loader = DataLoader(
        dataset,
        num_workers=workers,
        batch_size=batch_size,
        sampler=SubsetRandomSampler(val_inds)
    )
    loss_fn = torch.nn.CrossEntropyLoss()
    metrics = {
        'fps': training.BatchTimer(),
        'acc': training.accuracy
    }
    writer = SummaryWriter()
    writer.iteration, writer.interval = 0, 10

    print('\n\nInitial')
    print('-' * 10)

    for epoch in range(epochs):
        print('\nEpoch {}/{}'.format(epoch + 1, epochs))
        print('-' * 10)

        resnet.train()
        training.pass_epoch(
            resnet, loss_fn, train_loader, optimizer, scheduler,
            batch_metrics=metrics, show_running=True, device=device,
            writer=writer
        )




    writer.close()

    def generate_embeddings():
        dataset = datasets.ImageFolder('faces_cropped') # photos folder path 
        idx_to_class = {i:c for c,i in dataset.class_to_idx.items()} # accessing names of peoples from folder names

        mtcnn0 = MTCNN(
        image_size=160, margin=0, min_face_size=20,
        thresholds=[0.6, 0.7, 0.7], factor=0.709, post_process=False,
        device=device
            )
        resnet = InceptionResnetV1(pretrained='vggface2',classify=True,num_classes=len(dataset.class_to_idx)).to(device)
        resnet.load_state_dict(torch.load('face_recognition_model.pth'))
        resnet.eval()

        def collate_fn(x):
            return x[0]

        loader = DataLoader(dataset, collate_fn=collate_fn)

        name_list = [] # list of names corrospoing to cropped photos
        embedding_list = [] # list of embeding matrix after conversion from cropped faces to embedding matrix using resnet

        for img, idx in loader:
            face, prob = mtcnn0(img, return_prob=True)

            if face is not None and prob>0.92:
                face=face.to(device)
                emb = resnet(face.unsqueeze(0)) 
                embedding_list.append(emb.detach()) 
                name_list.append(idx_to_class[idx])        

        data = [embedding_list, name_list] 
        torch.save(data, 'data.pt')
        print("data saved")
    torch.save(resnet.state_dict(), 'face_recognition_model.pth')
    generate_embeddings()
    return "Training Completed... Procedd to recognition"
train_images()
