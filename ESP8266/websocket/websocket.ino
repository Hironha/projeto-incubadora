#include <ArduinoJson.h>
#include <DHT.h>
#include <ESP8266WiFi.h>
#include <IncubatorStepper.h>
#include <WebSocketsClient.h>

#define DHT_PIN 4
#define DHT_TYPE DHT11

#define STEPPER_STEP 2
#define STEPPER_DIR 0

const char *ssid = "AP_60";
const char *password = "145632789";

WebSocketsClient webSocket;

IncubatorStepper stepper(STEPPER_STEP, STEPPER_DIR);

DHT dht(DHT_PIN, DHT_TYPE);

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED: {
      Serial.println("[WSc] Disconnected!");
      break;
    }
    case WStype_CONNECTED: {
      Serial.println("[WSc] Connected to url");
      break;
    }
  }
}

void setup() {
  Serial.begin(9600);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());

  webSocket.begin("192.168.0.2", 80, "/incubator/send");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(3000);
  webSocket.enableHeartbeat(15000, 3000, 2);

  stepper.setMaxSpeed(100);
  stepper.setAcceleration(50);
  stepper.setInterval(30);
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    return;
  }
  webSocket.loop();

  loopSensor();

  stepper.loop();
}

void loopSensor() {
  const static time_t interval = 10;
  // float humidity = dht.readHumidity();
  // float temperature = dht.readTemperature();

  // if(isnan(humidity) || isnan(temperature)) {
  // return;
  //}

  if (checkSensorInterval(interval)) {
    sendSensorData(33.2, 25.66);
  }
}

void sendSensorData(float humidity, float temperature) {
  String buffer;
  DynamicJsonDocument doc(256);

  doc["humidity"] = humidity;
  doc["temperature"] = temperature;
  serializeJson(doc, buffer);
  
  webSocket.sendTXT(buffer);
}

bool checkSensorInterval(const time_t interval) {
  static time_t lastTime = 0;
  const time_t cur = millis();
  const time_t diff = cur - lastTime;

  if (lastTime == 0) {
    lastTime = cur;
  }

  if (diff < interval * 1000) {
    return false;
  }

  lastTime = cur;
  return true;
}
