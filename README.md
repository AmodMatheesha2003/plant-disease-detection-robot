# Leaf Guard: Plant Disease Detection Robot

## 🌱 Overview

**Leaf Guard** is an AI-powered Plant Disease Detection Robot that integrates IoT, Machine Learning, and Web/Mobile Interfaces to automate plant health monitoring. This system allows users to:

- Navigate the robot using a web-based controller.
- Capture leaf images using the ESP32-CAM.
- Classify diseases using a trained ML model.
- Monitor plant health in real-time via web and mobile apps.

## 🔧 Hardware Components

- **ESP32** - Main microcontroller for robot navigation.
- **ESP32-CAM** - Captures leaf images for classification.
- **Arduino Uno** - Interfaces with ESP32-CAM.
- **L298 Motor Driver** - Controls robot movement.
- **DHT11 Sensor** - Monitors temperature and humidity.
- **IR Sensors** - Enables line-following navigation.
- **Lithium Batteries** - Provides power to the system.

## 🖥️ Software & Technologies Used

- **IoT:** ESP32, Arduino, Firebase
- **Machine Learning:** Python, TensorFlow, Kaggle Dataset
- **Web Development:** HTML, CSS, JavaScript, Flask API
- **Mobile Development:** Kotlin (Android App)

## 🚀 How It Works

### 🌍 Web-Based Robot Controller

- Navigate the robot between Main Station, Plant 1, and Plant 2.
- Control the movement with a single click.

### 📸 Image Capture & Disease Classification

- ESP32-CAM streams live video.
- Captured images are sent to the Flask API.
- ML model classifies leaves as **Healthy**, **Powdery Mildew**, or **Rust**.
- Results are displayed on the Website & Mobile App.

### 📲 Mobile App

- Workers can view plant health status in real-time.
- Uses Firebase database for seamless data updates.

### 🔥 Real-Time Monitoring

- Temperature & humidity values are continuously updated.
- Plant disease status is displayed on a dashboard.

## ⚙️ Installation & Setup

Follow these steps to install and set up the **Leaf Guard** system:

### 1. **Hardware Setup**

- **Assemble the Robot:**
  - Connect the ESP32 and ESP32-CAM to the Arduino Uno using appropriate wiring.
  - Attach the IR sensors for navigation and the DHT11 sensor for environmental data.
  - Connect the L298 Motor Driver to control the motors and enable movement.
  - Ensure that the Lithium batteries are correctly connected to power the entire system.

### 2. **Software Setup**

- **ESP32 and Arduino Setup:**
  - Install the [Arduino IDE](https://www.arduino.cc/en/software) and set up the ESP32 board.
  - Upload the robot control code to the ESP32 using the Arduino IDE.

- **Machine Learning Model:**
  - Clone the repository to your local machine:
    ```bash
    git clone https://github.com/AmodMatheesha2003/plant-disease-detection-robot.git
    ```
  - Train the ML model using the provided dataset or use the pre-trained model.
  - Save the trained model as `model.h5` and place it in the Flask API folder.

- **Flask API Setup:**
  - Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```
  - Run the Flask API:
    ```bash
    python app.py
    ```

- **Mobile App Setup:**
  - Open the project in Android Studio.
  - Set up Firebase and connect the mobile app to the Firebase database.
  - Build and run the app on an Android device.

### 3. **Web Interface Setup**

- Navigate to the **Web-Based Controller** directory.
- Open the `LeafGuard.html` file in your web browser or deploy the app to a server.
- Control the robot and view real-time data from the dashboard.

## 🎬 Demonstration Video

Check out the demonstration video:  
[Leaf Guard Demo](https://youtu.be/zy8LyL_HekA?si=TFLWEEpS6RuRykBe)

⭐ If you find this project helpful, please star the repo! ⭐
## 🚀 Happy Coding!
