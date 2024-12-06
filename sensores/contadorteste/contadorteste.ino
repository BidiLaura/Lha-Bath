#include <DHT.h>             // Biblioteca para o sensor DHT
#include <NewPing.h>         // Biblioteca para o sensor ultrassônico
#include <ArduinoJson.h>     // Biblioteca para criar o objeto JSON

// Configurações do sensor D              HT11
#define DHTPIN A2            // Pino de dados do DHT11 (ambiente)
#define DHTTYPE DHT11        // Tipo do sensor DHT11
DHT dht(DHTPIN, DHTTYPE);    // Inicializa o sensor DHT

// Configurações dos sensores ultrassônicos
#define TRIG_PIN 3           // Pino TRIG do ultrassônico (ambiente)
#define ECHO_PIN 4           // Pino ECHO do ultrassônico (ambiente)
#define TRIG_PIN2 6          // Pino TRIG do ultrassônico (lixeira)
#define ECHO_PIN2 7          // Pino ECHO do ultrassônico (lixeira)
#define MAX_DISTANCE 200     // Distância máxima em cm
NewPing sonar(TRIG_PIN, ECHO_PIN, MAX_DISTANCE);
NewPing sonar2(TRIG_PIN2, ECHO_PIN2, MAX_DISTANCE);

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

  // Leitura do sensor ultrassônico (ambiente)
  unsigned int distance = sonar.ping_cm();

  // Leitura do sensor ultrassônico (lixeira)
  unsigned int distance2 = sonar2.ping_cm();

  // Cálculo da porcentagem baseada na distância (ambiente)
  float percentage;
  if (distance <= 5) {
    percentage = 100; // 100% quando <= 5 cm
  } else if (distance >= 60) {
    percentage = 0;   // 0% quando >= 60 cm
  } else {
    // Cálculo proporcional
    percentage = 100 - ((distance - 5) * 100.0 / (60 - 5));
  }

  // Cálculo da porcentagem baseada na distância (lixeira - lógica inversa)
  float percentage2;
  if (distance2 >= 5) {
    percentage2 = 0; // 0% quando <= 5 cm
  } else if (distance2 <= 60) {
    percentage2 = 100;   // 100% quando >= 60 cm
  } else {
    // Cálculo proporcional inverso
    percentage2 = ((distance2 - 5) * 100.0 / (60 - 5));
  }

  // Contador baseado no sensor infravermelho
  bool infraState = digitalRead(INFRA_PIN);
  if (infraState == HIGH && lastInfraState == LOW) {
    contador = 1;
  }
  lastInfraState = infraState;

  // Criação do objeto JSON
  StaticJsonDocument<400> jsonDoc;

  // Dados de humidade e temperatura
  JsonObject humidade = jsonDoc.createNestedObject("Umidade");
  humidade["humidity"] = humidity;
  humidade["Tipo_Sensor"] = "Umidade";

  JsonObject Temperatura = jsonDoc.createNestedObject("Temperatura");
  Temperatura["temperature"] = temperature;
  Temperatura["Tipo_Sensor"] = "Temperatura";

  // Dados de distância (papel - ambiente)
  JsonObject papel = jsonDoc.createNestedObject("Papel");
  papel["Percentage"] = percentage;
  papel["Tipo_Sensor"] = "Papel";

  // Dados de distância (lixeira)
  JsonObject lixeira = jsonDoc.createNestedObject("Lixeira");
  lixeira["Percentage2"] = percentage2;
  lixeira["Tipo_Sensor"] = "Lixeira";

  // Serializa o objeto JSON e envia via Serial
  serializeJson(jsonDoc, Serial);
  Serial.println(); // Nova linha para facilitar a leitura

  // Pausa para evitar leituras muito rápidas
  delay(1000);
}