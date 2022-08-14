#include <ArduinoJson.h>
#include <DHT.h>
#include <ESP8266WiFi.h>
#include <IncubatorStepper.h>
#include <WebSocketsClient.h>

#define DHT_PIN D1
#define DHT_TYPE DHT11

#define RELAY_PIN D0

#define STEPPER_STEP 2
#define STEPPER_DIR 0

#define MONITORING_EVENT "monitoring"

#define BULB_ON "on"
#define BULB_OFF "off"

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

  pinMode(RELAY_PIN, OUTPUT);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println(".");
    delay(500);
  }
  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());

  webSocket.begin("192.168.0.2", 80, "/incubator/send");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(3000);
  webSocket.enableHeartbeat(15000, 3000, 2);

  stepper.setMaxSpeed(80);
  stepper.setAcceleration(200);
  stepper.setInterval(10);
  stepper.setSteps(20);
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
  const static time_t interval = 5;
  /*
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("NAN");
    return;
  }

  
  if(temperature <= 36){
    digitalWrite(RELAY_PIN, HIGH);
  }else if (temperature >= 38) {
    digitalWrite(RELAY_PIN, LOW);
  }
  */

  if (checkSensorInterval(interval)) {
    Serial.printf("%.2f   %.2f\n", 78.3, 36.5);
    sendSensorData(78.3, 26.5);
  }
}

void sendSensorData(float humidity, float temperature) {
  String buffer;
  StaticJsonDocument<256> doc;

  doc["eventName"] = MONITORING_EVENT;
  doc["data"]["bulbStatus"] = BULB_ON;
  doc["data"]["humidity"] = humidity;
  doc["data"]["temperature"] = temperature;
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
