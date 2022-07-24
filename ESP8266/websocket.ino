#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>

const char *ssid = "AP_60"; // The name of the Wi-Fi network that will be created
const char *password = "145632789";   // The password required to connect to it, leave blank for an open network

WebSocketsClient webSocket;

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
  delay(10);
  Serial.println('\n');

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while (WiFi.status() != WL_CONNECTED){
    delay(500);
  }
  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());

  webSocket.begin("192.168.0.2", 80, "/incubator/send");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(3000);
  webSocket.enableHeartbeat(15000, 3000, 2);

}

void loop() {
  webSocket.loop();
  String str = String(counter);
  webSocket.sendTXT(str);
  if(WiFi.status() == WL_CONNECTED){
    Serial.print('.');
  }else {
    Serial.println("Não conectado ao wifi.");
  }

  counter += 1;
  delay(500);
 }
