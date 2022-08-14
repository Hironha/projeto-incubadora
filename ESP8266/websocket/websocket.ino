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
#define INIT_INCUBATION_EVENT "initIncubation"
#define INCUBATION_INITIALIZED_EVENT "incubationInitialized"

#define BULB_ON "on"
#define BULB_OFF "off"

typedef struct IncubationData {
  unsigned long duration;
  unsigned long roll_interval;
  int min_temperature;
  int max_temperature;
} IncubationData;

const char *ssid = "AP_60";
const char *password = "145632789";

IncubationData *incubationData = NULL;

WebSocketsClient webSocket;

IncubatorStepper stepper(STEPPER_STEP, STEPPER_DIR);

DHT dht(DHT_PIN, DHT_TYPE);

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED: {
      Serial.println("[WSc] Disconnected!");
      break;
    }
    case WStype_TEXT: {
      String event = (char*) payload;
      StaticJsonDocument<256> eventJSON;
      deserializeJson(eventJSON, event);
      handleStartIncubation(&eventJSON);
    }
    case WStype_CONNECTED: {
      Serial.println("[WSc] Connected to url");
      break;
    }
  }
}

void handleStartIncubation(StaticJsonDocument<256> *json) {
  String buffer;
  StaticJsonDocument<256> doc;

  doc = *json;
  doc["eventName"] = INCUBATION_INITIALIZED_EVENT;
  doc["data"]["status"] = "active";
  serializeJson(doc, buffer);
  webSocket.sendTXT(buffer);
  
  if(incubationData != NULL){
    delete incubationData;
    incubationData = NULL;
  }
  
  incubationData = new IncubationData;
  incubationData->roll_interval = (*json)["data"]["roll_interval"];
  incubationData->duration = (*json)["data"]["incubation_duration"];
  incubationData->min_temperature = (*json)["data"]["min_temperature"];
  incubationData->max_temperature = (*json)["data"]["max_temperature"];
  
  Serial.println(incubationData->roll_interval);
  Serial.println(incubationData->duration);
  Serial.println(incubationData->min_temperature);
  Serial.println(incubationData->max_temperature);
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

  while(incubationData == NULL) {
    webSocket.loop();
  }

  stepper.setMaxSpeed(80);
  stepper.setAcceleration(200);
  stepper.setSteps(20);
  stepper.setInterval(incubationData->roll_interval);
}

void loop() {
  if (WiFi.status() != WL_CONNECTED || incubationData == NULL) {
    return;
  }

  webSocket.loop();
  loopSensor();
  stepper.loop();

  delay(100);
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

  
  if(temperature <= incubationData->min_temperature){
    digitalWrite(RELAY_PIN, HIGH);
  }else if (temperature >= incubationData->max_temperature) {
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
  doc["data"]["bulb_status"] = BULB_ON;
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
