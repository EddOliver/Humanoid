#include <WiFi.h>
#include <MQTT.h>
#include <ArduinoJson.h>
#include <Adafruit_Fingerprint.h>

#define mySerial Serial1

const char* ssid = " "; //Enter SSID
const char* pass = " "; //Enter Password

WiFiClient net;
MQTTClient client;
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

unsigned long lastMillis = 0;

void connect() {
  Serial.print("checking wifi...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }

  Serial.print("\nconnecting...");
  while (!client.connect("Esp32", "random", " ")) {
    Serial.print(".");
    delay(1000);
  }

  Serial.println("\nconnected!");

  client.subscribe("0x905d45128f4ae35e2a5ea7b0210f8fa9a4f101d5/Humanoid");
}

void messageReceived(String &topic, String &payload) {
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, payload);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }
  const char* device = doc["device"];
  const char* dest = doc["dest"];
  const char* com = doc["com"];
  Serial.println(dest);
  Serial.println(com);
  if (String(dest) == "esp") {
    if (String(com) == "read") {
      int res;
      while(1){
        res = (int)getFingerprintID();
        if(res != 2){
          Serial.println(res);
          break;
        }
        delay(50);
      }
      client.publish("0x905d45128f4ae35e2a5ea7b0210f8fa9a4f101d5/Humanoid", "{\"device\":\"esp\",\"dest\":\"plat\",\"com\":\""+String(res)+"\"}");
    }
  }
}

void setup() {
  Serial.begin(115200);
  while (!Serial);
  WiFi.begin(ssid, pass);
  client.begin("18.212.177.52", net);
  client.onMessage(messageReceived);
  connect();

  finger.begin(57600);
  delay(5);
  if (finger.verifyPassword()) {
    Serial.println("Found fingerprint sensor!");
  } else {
    Serial.println("Did not find fingerprint sensor :(");
    while (1) {
      delay(1);
    }
  }
}

void loop() {
  client.loop();
  delay(10);  // <- fixes some issues with WiFi stability

  if (!client.connected()) {
    connect();
  }

  // publish a message roughly every second.
  if (millis() - lastMillis > 5000) {
    lastMillis = millis();
    //client.publish("0x905d45128f4ae35e2a5ea7b0210f8fa9a4f101d5/Humanoid", "{\"result\": \"1\"}");
  }
}

uint8_t getFingerprintID() {
  uint8_t p = finger.getImage();
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.println("No finger detected");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }

  // OK success!

  p = finger.image2Tz();
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }

  // OK converted!
  p = finger.fingerSearch();
  if (p == FINGERPRINT_OK) {
    Serial.println("Found a print match!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_NOTFOUND) {
    Serial.println("Did not find a match");
    return p;
  } else {
    Serial.println("Unknown error");
    return p;
  }

  // found a match!
  Serial.print("Found ID #"); Serial.print(finger.fingerID);
  Serial.print(" with confidence of "); Serial.println(finger.confidence);

  return finger.fingerID;
}

char* string2char(String command) {
  if (command.length() != 0) {
    char *p = const_cast<char*>(command.c_str());
    return p;
  }
}
