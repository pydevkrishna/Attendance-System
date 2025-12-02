# Real-Time Attendance System

A simple, real-time attendance system built with a modern tech stack. This application allows teachers to start an attendance session based on their current location, and students can mark themselves present only if they are within a 50-meter radius of the teacher's set location.

## Features

-   **User Roles:** Separate interfaces and logic for Teachers and Students.
-   **Secure Authentication:** User sign-up and login handled by Firebase Authentication.
-   **Geolocation:** Teachers set their current location as the attendance point.
-   **Proximity Validation:** Students can only mark attendance if they are physically close (within 50 meters) to the teacher's location.
-   **Real-Time Updates:** Teachers can see a live list of students who have marked their attendance.
-   **Modern Frontend:** A clean, responsive UI built with Bootstrap 5.

## Technology Stack

-   **Backend:** FastAPI (Python)
-   **Database:** MySQL
-   **Authentication:** Firebase Auth
-   **Frontend:** HTML, CSS, JavaScript (ES Modules)
-   **UI Framework:** Bootstrap 5 & Bootstrap Icons

## How to Run the Application

1.  **Prerequisites:**
    *   Python 3.7+
    *   A running MySQL server.
    *   A Firebase project.

2.  **Clone & Setup:**
    *   Clone this repository.
    *   Create and activate a Python virtual environment:
        ```bash
        python -m venv venv
        source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
        ```

3.  **Configure Environment Variables:**
    *   Create a file named `.env` in the project's root directory.
    *   Copy the contents of `env.example` into `.env` and fill in your specific credentials for MySQL and Firebase.

4.  **Update Frontend Configuration:**
    *   Open `frontend/js/config.js`.
    *   Replace the placeholder values in the `firebaseConfig` object with your actual Firebase project credentials.

5.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

6.  **Run the Backend Server:**
    *   From the **project root directory**, run:
    ```bash
    uvicorn backend.main:app --reload
    ```
    *   The backend will be running at `http://localhost:8000`.

7.  **Run the Frontend Server:**
    *   Open a **new terminal**.
    *   Navigate to the `frontend` directory:
        ```bash
        cd frontend
        ```
    *   Start the local web server:
        ```bash
        python -m http.server 8001
        ```
    *   The frontend server will be running at `http://localhost:8001`.

8.  **Access the Application:**
    *   Open your web browser and navigate to `http://localhost:8001`.
