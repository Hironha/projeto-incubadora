#include <ESP8266WiFi.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <DHT.h>
#include <WebSocketsClient.h>

#include <IncubatorStepper.h>

#define DHT_PIN 4
#define DHT_TYPE DHT11

#define STEPPER_STEP 2
#define STEPPER_DIR 0

const char *ssid = "Elza";
const char *password = "51300100";

WebSocketsClient webSocket;

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

IncubatorStepper stepper(STEPPER_STEP, STEPPER_DIR, timeClient);

DHT dht(DHT_PIN, DHT_TYPE);

int counter = 0;

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
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
  while (WiFi.status() != WL_CONNECTED){
    delay(500);
  }
  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());

  //webSocket.begin("192.168.0.2", 80, "/incubator/send");
  //webSocket.onEvent(webSocketEvent);
  //webSocket.setReconnectInterval(3000);
  //webSocket.enableHeartbeat(15000, 3000, 2);

  timeClient.begin();
  timeClient.setTimeOffset(0);

  stepper.setMaxSpeed(100);
  stepper.setAcceleration(50);
  stepper.setInterval(30);
}

void loop() {
  if(WiFi.status() != WL_CONNECTED){
    return;
  }
  
  //webSocket.loop();
  //String str = String(counter);
  //webSocket.sendTXT(str);
  //counter += 1;

  loopSensor();

  stepper.loop();

  //delay(500);
}

void loopSensor(){
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  if(isnan(humidity) || isnan(temperature)) {
    return;
  }

  Serial.printf("Humidity: %.2f\n", humidity);
  Serial.printf("Temperature: %.2f\n", temperature);
}
