#include <ESP8266WiFi.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <AccelStepper.h>
#include <WebSocketsClient.h>

const char *ssid = "AP_60"; // The name of the Wi-Fi network that will be created
const char *password = "145632789";   // The password required to connect to it, leave blank for an open network

WebSocketsClient webSocket;

WiFiUDP ntpUDP;

NTPClient timeClient(ntpUDP, "pool.ntp.org");

AccelStepper stepperX(AccelStepper::DRIVER, 2, 0); 

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
  Serial.println("Connecting");
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

  stepperX.setMaxSpeed(250);
  stepperX.setAcceleration(1000);
}

void loop() {
  static bool isClockwise = true;
  const static int steps = 25;
  const static bool shouldReturn = false;
  
  if(WiFi.status() != WL_CONNECTED){
    return;
  }
  
  //webSocket.loop();
  //String str = String(counter);
  //webSocket.sendTXT(str);
  //counter += 1;
  
  if(checkInterval(30)) {
    stepperX.moveTo(isClockwise ? steps : -steps);
    Serial.println("Caiu aqui");
    isClockwise = !isClockwise;
  }

  if(checkShouldReturn(steps)) {
    stepperX.moveTo(0);
  }

  if(stepperX.distanceToGo() != 0) {
    stepperX.run();
  }

  //delay(500);
}

bool checkShouldReturn(const int steps) {
  return stepperX.currentPosition() == steps || stepperX.currentPosition() == -steps;
}

 bool checkInterval(time_t interval) {
  static time_t lastTime = 0;
  const time_t cur = timeClient.getEpochTime();
  const time_t diff = cur - lastTime;
  
  if(lastTime == 0) {
    lastTime = cur;
  }

  if(diff < interval){
    return false;
  }

  lastTime = cur;
  return true;
 }
