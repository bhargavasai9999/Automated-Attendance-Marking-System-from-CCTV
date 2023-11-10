import imageio

# RTSP link to your video stream with username and password
rtsp_url = 'rtsp://admin:admin@192.168.0.103:1935'

# Open RTSP stream
video_reader = imageio.get_reader(rtsp_url, format='ffmpeg', input_params=['-rtsp_transport', 'tcp'])

for frame in video_reader:
    # Display the frame (you may need to use a different library for this part)
    # Here, we simply print the frame shape as an example
    print(f"Frame shape: {frame.shape}")
