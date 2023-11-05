import cv2
import os
import time
import keyboard
import shutil

# Set the path to the desktop
desktop_path = r"C:\attendance\backend\env\faces"

# Initialize the webcam
cap = cv2.VideoCapture(1)

# Create an OpenCV window to display the frame
cv2.namedWindow("Capture Images", cv2.WINDOW_NORMAL)

# Create a variable to store the user's name
name = ""

# Function to handle keyboard input
def handle_keyboard_input(e):
    global name
    if e.event_type == keyboard.KEY_DOWN:
        if e.name == "enter":
            return
        elif e.name == "backspace":
            name = name[:-1]
        else:
            name += e.name

# Set up the event handler for keyboard input
keyboard.hook(handle_keyboard_input)

# Flag to track whether the directory has been removed
directory_removed = False

while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to capture an image.")
        continue

    # Display the frame in the OpenCV window
    cv2.imshow("Capture Images", frame)

    # Display an input box for the user to enter their name
    cv2.putText(
        frame,
        "Enter your name: " + name,
        (10, 30),  # Position of the input box label
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 0, 255),  # Red color for the label
        2,  # Thickness of the label text
    )

    # Check for Enter key press to confirm the name
    if cv2.waitKey(1) & 0xFF == 13:  # Enter key is pressed
        break

# Release the keyboard event hook
keyboard.unhook_all()

# Create a folder with the user's name to store the captured images
image_folder = os.path.join(desktop_path, name)
os.makedirs(image_folder, exist_ok=True)

# Counter for captured images
capture_count = 0

while capture_count < 100:
    ret, frame = cap.read()
    if not ret:
        print("Failed to capture an image.")
        continue

    # Display an alert message and count on the frame
    alert_message = "Please rotate your face"
    count_message = f"Image {capture_count + 1}/100"
    image_filename = f"{name +'('+ str(capture_count)+')'}.jpg"
    image_path = os.path.join(image_folder, image_filename)
    cv2.imwrite(image_path, frame)
    cv2.putText(
        frame,
        alert_message,
        (10, 30),  # Position of the alert text
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 0, 255),  # Red color for the alert text
        2,  # Thickness of the alert text
    )
    cv2.putText(
        frame,
        count_message,
        (10, 70),  # Position of the count text
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 0),  # Green color for the count text
        2,  # Thickness of the count text
    )

    # Display the frame in the OpenCV window
    cv2.imshow("Capture Images", frame)

    # Save the captured image
    capture_count += 1
    print(f"Captured image {capture_count}/100")

    # Wait for 0.3 seconds before capturing the next image
    time.sleep(0.3)

    # Check for user input to close the window (press 'q') or remove the directory (press 'esc')
    key = cv2.waitKey(1) & 0xFF
    if key == ord('q'):
        break
    elif key == 27:  # 27 is the ASCII code for the Escape key
        # Release the webcam, destroy the OpenCV window
        cap.release()
        cv2.destroyAllWindows()
        # Remove the created directory and its contents
        if os.path.exists(image_folder):
            shutil.rmtree(image_folder)
            directory_removed = True
        print ("Image capture cancelled. Directory removed.")
        break

# Check if the directory was removed earlier, and if not, remove it now


