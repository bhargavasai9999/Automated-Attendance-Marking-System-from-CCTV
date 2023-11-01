import cv2
import os
import time

# Set the path to the desktop
desktop_path = r"C:\attendance\backend\env\faces"
name=input("enter name: ")
image_folder = os.path.join(desktop_path, name)
os.makedirs(image_folder, exist_ok=True)

# Initialize the webcam
cap = cv2.VideoCapture(0)

# Create an OpenCV window to display the frame
cv2.namedWindow("Capture Images", cv2.WINDOW_NORMAL)

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
    image_filename = f"image_{capture_count}.jpg"
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

    # Wait for 2 seconds before capturing the next image
    time.sleep(0.3)

    # Check for user input to close the window (press 'q')
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the webcam, destroy the OpenCV window, and close it
cap.release()
cv2.destroyAllWindows()

print("Image capture completed. Images saved to", image_folder)
