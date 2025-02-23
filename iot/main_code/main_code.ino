#include <Adafruit_Sensor.h>
#include <Arduino.h>
#include <DHT.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

#define WIFI_SSID "Hi"
#define WIFI_PASSWORD "amod1234"

#define API_KEY "AIzaSyC8dKSLSurlgo0pXkqIcVVz1xcaz5x_CQM"
#define DATABASE_URL "https://leaf-guard-bce3b-default-rtdb.asia-southeast1.firebasedatabase.app/" 

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

#define DHTPIN 4

#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

#define IN1 12
#define IN2 13
#define IN3 14
#define IN4 27
#define ENA 32
#define ENB 33
#define speed 70
#define turnspeed 100

#define IR_LEFT 34
#define IR_MIDDLE 35
#define IR_RIGHT 39
#define THRESHOLD 1000

unsigned long sendDataPrevMillis = 0;
bool signupOK = false;
float temperature = 0;
float humidity = 0;

int user_selected_plant = 1;
int currunt_position = 0;

void setup() {
  Serial.begin(115200);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  if (Firebase.signUp(&config, &auth, "", "")){
    Serial.println("ok");
    signupOK = true;
  }
  else{
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  dht.begin();
  
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  pinMode(ENA, OUTPUT);
  pinMode(ENB, OUTPUT);
}

void moveForward() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
  analogWrite(ENA, speed);
  analogWrite(ENB, speed);
  Serial.println("Moving Forward");
}

void moveBackward() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
  analogWrite(ENA, speed);
  analogWrite(ENB, speed);
  Serial.println("Moving Backward");
}

void turnRight() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
  analogWrite(ENA, turnspeed);
  analogWrite(ENB, turnspeed);
  Serial.println("Turning Left");
}

void turnLeft() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
  analogWrite(ENA, turnspeed);
  analogWrite(ENB, turnspeed);
  Serial.println("Turning Right");
}

void stopMotors() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
  analogWrite(ENA, 0);
  analogWrite(ENB, 0);
  Serial.println("Motors Stopped");
}

void temperatureHumidity(){
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();

  if (isnan(temperature) || isnan(humidity)) {
      Serial.println("Failed to read from DHT sensor!");
      return;
  }

  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println("°C");

  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println("%");

  if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 5000 || sendDataPrevMillis == 0)){
    sendDataPrevMillis = millis();
    if(Firebase.RTDB.setFloat(&fbdo,"sensor_data/temperature",temperature)){
      Serial.println("Data Saved to:"+fbdo.dataPath()); 
    }
    else{
      Serial.println("Error:"+fbdo.errorReason());
    }
    if(Firebase.RTDB.setFloat(&fbdo,"sensor_data/humidity",humidity)){
      Serial.println("Data Saved to:"+fbdo.dataPath()); 
    }
    else{
      Serial.println("Error:"+fbdo.errorReason());
    }       
  }
}

void navigation(){
  int leftValue = analogRead(IR_LEFT);
  int middleValue = analogRead(IR_MIDDLE);
  int rightValue = analogRead(IR_RIGHT);

  int leftir = (leftValue < THRESHOLD) ? 0 : 1;  // 1-black
  int middleir = (middleValue < THRESHOLD) ? 0 : 1;
  int rightir = (rightValue < THRESHOLD) ? 0 : 1;

  if(currunt_position==0 && user_selected_plant==1){
    if(middleir==1){
      moveForward();
      if(rightir==1){
        currunt_position = 1;
        Serial.print("Current Position: ");
        Serial.println(currunt_position);
        stopMotors();
        delay(100);
        turnRight();
        delay(1000);
        stopMotors();
        Serial.println("Stoped at plant 1");
      }
    }
  }else if((currunt_position==0 || currunt_position==1 ) && user_selected_plant==2){
    if(middleir==1){
      moveForward();
      if(rightir==1){
        currunt_position = currunt_position + 1;
        Serial.print("Current Position: ");
        Serial.println(currunt_position);
        delay(500);
        if(currunt_position == 2){
          stopMotors();
          delay(100);
          turnRight();
          delay(1000);
          stopMotors();
          Serial.println("Stoped at plant 2");
        }
      }
    }
  }
}


void loop() {
  // temperaturenavigation();
  navigation();
  delay(2000); 
}
