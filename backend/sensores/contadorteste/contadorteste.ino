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
  StaticJsonDocument<300> jsonDoc;

  // Dados de humidade e temperatura
  JsonObject humidade = jsonDoc.createNestedObject("Humidade");
  humidade["humidity"] = humidity;  // Corrigido para usar o nome correto
  humidade["Tipo_Sensor"] = "Humidade";

  JsonObject Temperatura = jsonDoc.createNestedObject("Temperatura");
  Temperatura["temperature"] = temperature;  // Corrigido para usar o nome correto
  Temperatura["Tipo_Sensor"] = "Temperatura";

  // Dados de distância (papel)
  JsonObject papel = jsonDoc.createNestedObject("Papel");
  papel["Distance"] = distance;
  papel["Tipo_Sensor"] = "Papel";

  // Dados do contador (lixeira)
  JsonObject lixeira = jsonDoc.createNestedObject("Lixeira");
  lixeira["Contador"] = contador;
  lixeira["Tipo_Sensor"] = "Lixeira";

  // Serializa o objeto JSON e envia via Serial
  serializeJson(jsonDoc, Serial);
  Serial.println(); // Nova linha para facilitar a leitura

  // Pausa para evitar leituras muito rápidas
  delay(1000);
}
