#include <DHT.h>             // Biblioteca para o sensor DHT
#include <NewPing.h>         // Biblioteca para o sensor ultrassônico
#include <ArduinoJson.h>     // Biblioteca para criar o objeto JSON

// Configurações do sensor DHT11
#define DHTPIN A2            // Pino de dados do DHT11
#define DHTTYPE DHT11        // Tipo do sensor DHT11
DHT dht(DHTPIN, DHTTYPE);    // Inicializa o sensor DHT

// Configurações do sensor ultrassônico
#define TRIG_PIN 3           // Pino TRIG do ultrassônico
#define ECHO_PIN 4           // Pino ECHO do ultrassônico
#define MAX_DISTANCE 200     // Distância máxima em cm
NewPing sonar(TRIG_PIN, ECHO_PIN, MAX_DISTANCE);

// Configurações do contador infravermelho
#define INFRA_PIN 5          // Pino do sensor infravermelho
bool lastInfraState = LOW;   // Estado anterior do sensor
int contador = 0;            // Contador

void setup() {
  Serial.begin(9600);
  Serial.println("Sistema Iniciado");

  // Inicializa os sensores
  dht.begin();
  pinMode(INFRA_PIN, INPUT);
}

void loop() {
  // Leitura do sensor DHT11
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  // Leitura do sensor ultrassônico
  unsigned int distance = sonar.ping_cm();

  // Contador baseado no sensor infravermelho
  bool infraState = digitalRead(INFRA_PIN);
  if (infraState == HIGH && lastInfraState == LOW) {
    contador++;
  }
  lastInfraState = infraState;

  // Criação do objeto JSON
  StaticJsonDocument<200> jsonDoc;
  jsonDoc["humi"] = isnan(humidity) ? 0 : humidity;
  jsonDoc["temp"] = isnan(temperature) ? 0 : temperature;
  jsonDoc["distance"] = distance;
  jsonDoc["contador"] = contador;

  // Serializa o objeto JSON e envia pela porta serial
  serializeJson(jsonDoc, Serial);
  Serial.println();

  // Pausa para evitar leituras muito rápidas
  delay(1000);
}
