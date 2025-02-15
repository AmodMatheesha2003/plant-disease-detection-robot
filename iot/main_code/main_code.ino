#include <Adafruit_Sensor.h>
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

unsigned long sendDataPrevMillis = 0;
bool signupOK = false;
float temperature = 0;
float humidity = 0;

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
}

void loop() {
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
  delay(2000); 
}
