#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

//-------- Customise these values -----------
const char *ssid = "__WIFI_SSID__";
const char *password = "__WIFI_PASS__";
const char *server = "__API_ENDPOINT__"; // API endpoint where server is running, e.g: http://192.168.0.100/api/
//-------- Customise the above values --------

WiFiClient wifiClient;

int publishInterval = 5000; // milliseconds
long lastPublishMillis;

void setup()
{
    serialConntent();
    wifiConnect();
}

void loop()
{
    if (WiFi.status() == WL_CONNECTED)
    {
        if (millis() - lastPublishMillis > publishInterval)
        {
            publishData("humidity", readHumidity());
            publishData("temperature", readTemperature());
            publishData("pressure", readPressure());

            lastPublishMillis = millis();
        }
    }
}

void serialConntent()
{
    Serial.begin(115200);
    Serial.println();
}

void wifiConnect()
{
    Serial.print("Connecting to ");
    Serial.print(ssid);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.print("'\nWiFi connected, IP address: ");
    Serial.println(WiFi.localIP());
}

void publishData(String sensor, int value)
{
    HTTPClient http;
    String payload = "{ \"value\": ";
    payload += value;
    payload += " }";


    String endpoint = server + sensor;
    http.begin(endpoint);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Accept", "application/json");

    Serial.print("Sending payload ( ");
    Serial.print(sensor);
    Serial.print(" ): ");
    Serial.println(payload);

    int httpCode = http.POST(payload);

    if (httpCode > 0)
    {
        Serial.println("Publish OK");
    }
    else
    {
        Serial.println("Publish FAILED");
    }

    http.end();
}

int readHumidity()
{
    // TODO read data from real sensor

    return random(20, 80);
}

int readTemperature()
{
    // TODO read data from real sensor

    return random(0, 35);
}

int readPressure()
{
    // TODO read data from real sensor

    return random(980, 1080);
}
