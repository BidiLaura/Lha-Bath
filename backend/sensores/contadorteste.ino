#include <Ultrasonic.h>
#include <DHT.h>
#include <ArduinoJson.h> // Biblioteca para trabalhar com JSON

const int pinoDHT11 = A2;
const int pinoTrigger = 5;
const int pinoEcho = 4;
const int pinoInfra = 6;

dht DHT;

int contador = 0; 

Ultrasonic ultrasonic(pinoTrigger, pinoEcho); // Configuração do sensor ultrassônico

void setup() {
  Serial.begin(9600);
  pinMode(pinoInfra, INPUT);
  Serial.print("Lha-Bath");
}

void loop() {
  // Sensor de umidade e temperatura
  DHT.read11(pinoDHT11); 
  float humi = DHT.humidity; // Umidade
  float temp = DHT.temperature; // Temperatura

  // Sensor ultrassônico
  long microsec = ultrasonic.timing();
  float cmMsec = ultrasonic.convert(microsec, Ultrasonic::CM); // Distância em cm

  // Sensor infravermelho
  int leitura = digitalRead(pinoInfra);
  if (leitura != 1) {
    contador += 1;
  }

  // Criação do objeto JSON
  StaticJsonDocument<200> doc;  // Tamanho do documento JSON, ajuste conforme necessário
  doc["humi"] = humi;
  doc["temp"] = temp;
  doc["contador"] = contador;
  doc["cmMsec"] = cmMsec;

  // Serializando o JSON para enviar ao Node-RED
  String output;
  serializeJson(doc, output);
  Serial.println(output); // Envia os dados para o serial (pode ser lido pelo Node-RED)

  delay(2000); // Espera 2 segundos antes de ler novamente
}
