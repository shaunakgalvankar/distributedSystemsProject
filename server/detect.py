import cv2
import mediapipe as mp

mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_face_mesh = mp.solutions.face_mesh

drawing_spec = mp_drawing.DrawingSpec(thickness=1, circle_radius=1)

# Initialize webcam
cap = cv2.VideoCapture(0)

with mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5) as face_mesh:
    while cap.isOpened():
        success, image = cap.read()

        if not success:
            break

        # Convert the color space from BGR to RGB
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # To improve performance
        image.flags.writeable = False

        # Detect the face landmarks
        results = face_mesh.process(image)

        # To improve performance
        image.flags.writeable = True

        # Convert back to the BGR color space
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        # Draw the face mesh annotations on the image.
        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                mp_drawing.draw_landmarks(
                    image=image,
                    landmark_list=face_landmarks,
                    connections=mp_face_mesh.FACEMESH_TESSELATION,
                    landmark_drawing_spec=None,
                    connection_drawing_spec=mp_drawing_styles.get_default_face_mesh_tesselation_style())

        # Display the image
        cv2.imshow('MediaPipe FaceMesh', image)

        # Check for key press
        key = cv2.waitKey(1)

        # Press 'q' to exit
        if key == ord('q'):
            break

# Release the webcam and close all windows
cap.release()
cv2.destroyAllWindows()

