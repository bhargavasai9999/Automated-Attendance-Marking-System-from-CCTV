import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
const Camera = () => {
  const [cameras, setCameras] = useState([]);
  const [newCamera, setNewCamera] = useState({ camera_id: '', camera_name: '', camera_address: '' });
  const [editingCamera, setEditingCamera] = useState(null);
  useEffect(() => {
    
  axios.get("http://3.110.118.195/get_camera").then(res=>{
    setCameras(res.data)
  })
  }, [])
  
  const addCamera = () => {
    if (newCamera.camera_id && newCamera.camera_name) {
        
     
      axios.post("http://3.110.118.195/add_camera",newCamera).then(res=>{
        alert(res.data.message)
    })
      setNewCamera({ camera_id: '', camera_name: '', camera_address: '' });
    }
  };

  const saveEditedCamera = () => {
    if (editingCamera) {
      setCameras(cameras.map((camera) => {
        if (camera.camera_id === editingCamera.camera_id) {
            console.log(editingCamera)
            axios.post('http://3.110.118.195/update_camera',editingCamera).then(res=>alert(res.data.message))
          return editingCamera;
        }
        return camera;
      }));
      setEditingCamera(null);
    }
  };

  const deleteCamera = (id) => {
    
    setCameras(cameras.filter((camera) => camera.camera_id !== id));
    axios.post("http://3.110.118.195/delete_camera",{'camera_id':id}).then(res=>{
            alert(res.data.message)
        })
    if (editingCamera && editingCamera.camera_id === id) { 
      setEditingCamera(null);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Camera Management</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Camera ID</th>
            <th style={tableHeaderStyle}>Camera Name</th>
            <th style={tableHeaderStyle}>Camera Address</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cameras.map((camera) => (
            <tr key={camera.camera_id}>
              <td style={tableDataStyle}>{editingCamera && editingCamera.camera_id === camera.camera_id ? (
                <input
                  type="text"
                  value={editingCamera.camera_id}
                  onChange={(e) => setEditingCamera({ ...editingCamera, camera_id: e.target.value })}
                  style={inputStyle}
                />
              ) : camera.camera_id}
              </td>
              <td style={tableDataStyle}>{editingCamera && editingCamera.camera_id === camera.camera_id ? (
                <input
                  type="text"
                  value={editingCamera.camera_name}
                  onChange={(e) => setEditingCamera({ ...editingCamera, camera_name: e.target.value })}
                  style={inputStyle}
                />
              ) : camera.camera_name}
              </td>
              <td style={tableDataStyle}>{editingCamera && editingCamera.camera_id === camera.camera_id ? (
                <input
                  type="text"
                  value={editingCamera.camera_address}
                  onChange={(e) => setEditingCamera({ ...editingCamera, camera_address: e.target.value })}
                  style={inputStyle}
                />
              ) : camera.camera_address}
              </td>
              <td style={tableDataStyle}>
                {editingCamera && editingCamera.camera_id === camera.camera_id ? (
                  <div>
                    <button style={saveButtonStyle} onClick={saveEditedCamera}>Save</button>
                    <button style={cancelButtonStyle} onClick={() => setEditingCamera(null)}>Cancel</button>
                  </div>
                ) : (
                  <div>
                    <button style={editButtonStyle} onClick={() => setEditingCamera({ ...camera })}>Edit</button>
                    <button style={deleteButtonStyle} onClick={() => deleteCamera(camera.camera_id)}>Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={addCameraSectionStyle}>
        <h3 style={addHeaderStyle}>Add Camera</h3>
        <input
          type="number"
          placeholder="Camera ID"
          value={newCamera.camera_id}
          onChange={(e) => setNewCamera({ ...newCamera, camera_id: e.target.value })}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Camera Name"
          value={newCamera.camera_name}
          onChange={(e) => setNewCamera({ ...newCamera, camera_name: e.target.value })}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Camera Address"
          value={newCamera.camera_address}
          onChange={(e) => setNewCamera({ ...newCamera, camera_address: e.target.value })}
          style={inputStyle}
        />
        <button style={addButtonStyle} onClick={addCamera}>Add Camera</button>
      </div>
    </div>
  );
};

const containerStyle = {
  fontFamily: 'Arial',
  padding: '20px',
  maxWidth: '800px',
  margin: '0',
};

const headerStyle = {
  fontSize: '24px',
  marginBottom: '20px',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const tableHeaderStyle = {
  background: '#007BFF',
  color: 'white',
  padding: '10px',
  textAlign: 'left',
  
  textAlign:'center'

};

const tableDataStyle = {
  border: '1px solid #ccc',
  padding: '5px',
  textAlign:'center'
};

const editButtonStyle = {
  backgroundColor: '#007BFF',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  margin: '5px',
  cursor: 'pointer',
  borderRadius:'5px'
};

const saveButtonStyle = {
  backgroundColor: '#5cb85c',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  margin: '5px',
  cursor: 'pointer',
  borderRadius:'5px'
};

const cancelButtonStyle = {
  backgroundColor: '#d9534f',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  margin: '5px',
  cursor: 'pointer',
  borderRadius:'5px'
};

const deleteButtonStyle = {
  backgroundColor: '#d9534f',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  margin: '5px',
  cursor: 'pointer', 
   borderRadius:'5px'
};

const inputStyle = {
  padding: '5px',
  marginRight: '10px',
  borderRadius:'5px',
 
};

const addButtonStyle = {
  backgroundColor: '#5cb85c',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  margin: '5px',
  cursor: 'pointer',
  borderRadius:'5px'
};

const addCameraSectionStyle = {
  marginTop: '20px',
};

const addHeaderStyle = {
  fontSize: '18px',
};

export default Camera;
