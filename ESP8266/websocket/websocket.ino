#include <ArduinoJson.h>
#include <DHT.h>
#include <ESP8266WiFi.h>
#include <IncubatorStepper.h>
#include <NTPClient.h>
#include <WebSocketsClient.h>
#include <WiFiUdp.h>
#include <WiFiManager.h>
#include <Ticker.h>

#define LED LED_BUILTIN

#define DHT_PIN 15 //D8
#define DHT_TYPE DHT11

#define RELAY_PIN 0 //D3

#define STEPPER_STEP 16 //D0
#define STEPPER_DIR 5 //D1

#define MONITORING_EVENT "monitoring"
#define INIT_INCUBATION_EVENT "initIncubation"
#define INCUBATION_INITIALIZED_EVENT "incubationInitialized"
#define INCUBATION_FINISHED_EVENT "incubationFinished"

#define BULB_ON "on"
#define BULB_OFF "off"

Ticker ticker;

String strMacAddress;
char macAddress[6];

typedef struct IncubationData {
  time_t finish_timestamp;
  unsigned long duration;
  unsigned long roll_interval;
  int min_temperature;
  int max_temperature;
} IncubationData;

//const char *ssid = "Zhone_852D";
//const char *password = "znid309602349";

IncubationData *incubationData = NULL;

WebSocketsClient webSocket;

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 0, 10 * 1000);
WiFiClient clienteWIFI;

void piscar() {
  digitalWrite(LED, !digitalRead(LED));
}

void configuracaoCallback(WiFiManager *gerenciadorWiFi) {
  Serial.println("Modo de configuração ativado!");
  ticker.attach(0.2, piscar);
}

IncubatorStepper stepper(STEPPER_STEP, STEPPER_DIR);

DHT dht(DHT_PIN, DHT_TYPE);

void clearIncubationData() {
  if (incubationData != NULL) {
    delete incubationData;
  }
  incubationData = NULL;
}

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED: {
      Serial.println("[WSc] Disconnected!");
      break;
    }
    case WStype_TEXT: {
      String event = (char *)payload;
      StaticJsonDocument<256> eventJSON;
      deserializeJson(eventJSON, event);
      String eventName = eventJSON["eventName"];
      Serial.println(eventName);
      if(eventName.equals(INIT_INCUBATION_EVENT)) {
        handleStartIncubation(&eventJSON);
      }
    }
    case WStype_CONNECTED: {
      Serial.println("[WSc] Connected to url");
      break;
    }
  }
}

void handleStartIncubation( StaticJsonDocument<256> *json ) {
  String buffer;
  StaticJsonDocument<256> doc;

  doc["data"] = (*json)["data"];
  doc["eventName"] = INCUBATION_INITIALIZED_EVENT;
  doc["data"]["status"] = "active";
  serializeJson(doc, buffer);
  webSocket.sendTXT(buffer);

  clearIncubationData();

  incubationData = new IncubationData;
  incubationData->roll_interval = (*json)["data"]["roll_interval"];
  incubationData->duration = (*json)["data"]["incubation_duration"];
  incubationData->min_temperature = (*json)["data"]["min_temperature"];
  incubationData->max_temperature = (*json)["data"]["max_temperature"];
  incubationData->finish_timestamp = incubationData->duration + timeClient.getEpochTime();
  stepper.setInterval(incubationData->roll_interval);

  Serial.println(incubationData->roll_interval);
  Serial.println(incubationData->duration);
  Serial.println(incubationData->min_temperature);
  Serial.println(incubationData->max_temperature);
}

void handleIncubationFinished() {
  String buffer;
  StaticJsonDocument<256> doc;

  doc["eventName"] = INCUBATION_FINISHED_EVENT;
  doc["data"] = NULL;

  serializeJson(doc, buffer);
  webSocket.sendTXT(buffer);

  clearIncubationData();
}

void setup() {
  Serial.begin(9600);

  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LED, OUTPUT);

  WiFi.mode(WIFI_STA);
  ticker.attach(0.6, piscar);

  WiFiManager gerenciadorWiFi;
  //gerenciadorWiFi.resetSettings();
  gerenciadorWiFi.setDebugOutput(false);
  gerenciadorWiFi.setAPCallback(configuracaoCallback);

  if (!gerenciadorWiFi.autoConnect("ESP8266_WiFi")) {
    Serial.print("Falha na conexão com a WiFi");
    ESP.restart();
    delay(1000);
  }

  Serial.println();
  Serial.println("WiFi conectado!");
  Serial.print("Endereço IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();
  strMacAddress = WiFi.macAddress();
  strMacAddress.toCharArray(macAddress, 6);

  ticker.detach();

  digitalWrite(LED, LOW);

//  WiFi.begin(ssid, password);
//  while (WiFi.status() != WL_CONNECTED) {
//    Serial.print(".");
//    delay(500);
//  }
//  Serial.print("Connected, IP address: ");
//  Serial.println(WiFi.localIP());

  webSocket.begin("192.168.1.16", 80, "/incubator/send");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(3000);
  webSocket.enableHeartbeat(15000, 3000, 2);

  timeClient.begin();
  
  while (incubationData == NULL) {
    timeClient.update();
    webSocket.loop();
    delay(200);
  }

  stepper.setMaxSpeed(80);
  stepper.setAcceleration(200);
  stepper.setSteps(20);
}

void loop() {
  timeClient.update();
  webSocket.loop();
 
  if (WiFi.status() != WL_CONNECTED || incubationData == NULL) return;
  
  if(checkFinishedIncubation(20)){
    Serial.println(timeClient.getEpochTime());
    handleIncubationFinished();
    return;
  }

  loopSensor();
  stepper.loop();
  delay(200);
}

void loopSensor() {
  const static time_t interval = 5;
  static bool bulbStatus = false;
  
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("NAN");
    return;
  }


  if(temperature <= incubationData->min_temperature){
    digitalWrite(RELAY_PIN, HIGH);
    bulbStatus = true;
  }else if (temperature >= incubationData->max_temperature) {
    digitalWrite(RELAY_PIN, LOW);
    bulbStatus = false;
  }

  if (checkSensorInterval(interval)) {
    //Serial.printf("%.2f   %.2f\n", 78.3, 36.5);
    sendSensorData(humidity, temperature, bulbStatus);
  }
}

void sendSensorData(float humidity, float temperature, bool bulbStatus) {
  String buffer;
  StaticJsonDocument<256> doc;

  doc["eventName"] = MONITORING_EVENT;
  doc["data"]["bulb_status"] = bulbStatus ? BULB_ON : BULB_OFF;
  doc["data"]["humidity"] = humidity;
  doc["data"]["temperature"] = temperature;
  serializeJson(doc, buffer);

  webSocket.sendTXT(buffer);
}

bool checkFinishedIncubation(const time_t interval) {
  static time_t lastTime = 0;
  const time_t cur = millis();
  const time_t diff = cur - lastTime;

  if (lastTime == 0) {
    lastTime = cur;
    return false;
  }

  if (diff < interval * 1000) return false;

  lastTime = cur;
  return timeClient.getEpochTime() >= incubationData->finish_timestamp;
}

bool checkSensorInterval(const time_t interval) {
  static time_t lastTime = 0;
  const time_t cur = millis();
  const time_t diff = cur - lastTime;

  if (lastTime == 0) {
    lastTime = cur;
  }

  if (diff < interval * 1000) return false;

  lastTime = cur;
  return true;
}
