#include <DHT.h>             // Biblioteca para o sensor DHT
#include <ArduinoJson.h>     // Biblioteca para criar o objeto JSON

// Configurações do sensor DHT11
#define DHTPIN A2            // Pino de dados do DHT11 (ambiente)
#define DHTTYPE DHT11        // Tipo do sensor DHT11
DHT dht(DHTPIN, DHTTYPE);    // Inicializa o sensor DHT

// Configurações dos sensores ultrassônicos
#define TRIG_PIN 3           // Pino TRIG do ultrassônico (ambiente)
#define ECHO_PIN 4           // Pino ECHO do ultrassônico (ambiente)
#define TRIG_PIN2 6          // Pino TRIG do ultrassônico (lixeira)
#define ECHO_PIN2 7          // Pino ECHO do ultrassônico (lixeira)
#define TRIG_PIN3 8          // Pino TRIG do ultrassônico (sabão)
#define ECHO_PIN3 9          // Pino ECHO do ultrassônico (sabão)

// Função para medir a distância com o sensor ultrassônico
unsigned int readUltrasonicDistance(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  unsigned long duration = pulseIn(echoPin, HIGH, 30000); // Timeout de 30ms
  return duration / 58; // Converte para cm
}

void setup() {
  Serial.begin(9600);
  Serial.println("Sistema Iniciado");

  // Configurar pinos dos sensores ultrassônicos como saída/entrada
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(TRIG_PIN2, OUTPUT);
  pinMode(ECHO_PIN2, INPUT);
  pinMode(TRIG_PIN3, OUTPUT);
  pinMode(ECHO_PIN3, INPUT);

  dht.begin();
}

void loop() {
  // Leitura do sensor DHT11
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  // Leitura dos sensores ultrassônicos
  unsigned int distance = readUltrasonicDistance(TRIG_PIN, ECHO_PIN);
  unsigned int distance2 = readUltrasonicDistance(TRIG_PIN2, ECHO_PIN2);
  unsigned int distance3 = readUltrasonicDistance(TRIG_PIN3, ECHO_PIN3);

// Cálculo da porcentagem baseada na distância (papel)
float percentage;
if (distance <= 3) {
  percentage = 100; // 100% quando <= 3 cm
} else if (distance >= 30) {
  percentage = 0;   // 0% quando >= 30 cm
} else {
  // Cálculo proporcional
  percentage = 100 - ((distance - 3) * 100.0 / (30 - 3));
}

// Cálculo da porcentagem baseada na distância (lixeira)
float percentage2;
if (distance2 <= 2) {
  percentage2 = 100; // 100% quando <= 2 cm
} else if (distance2 >= 50) {
  percentage2 = 0;   // 0% quando >= 50 cm
} else {
  // Cálculo proporcional
  percentage2 = 100 - ((distance2 - 2) * 100.0 / (50 - 2));
}

// Cálculo da porcentagem baseada na distância (sabão)
float percentage3;
if (distance3 <= 3) {
  percentage3 = 100; // 100% quando <= 3 cm
} else if (distance3 >= 15) {
  percentage3 = 0;   // 0% quando >= 15 cm
} else {
  // Cálculo proporcional
  percentage3 = 100 - ((distance3 - 3) * 100.0 / (15 - 3));
}

  // Criação do objeto JSON
  StaticJsonDocument<400> jsonDoc;

  // Dados de umidade e temperatura
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

  // Dados de distância (sabão)
  JsonObject sabao = jsonDoc.createNestedObject("Sabão");
  sabao["Percentage3"] = percentage3;
  sabao["Tipo_Sensor"] = "Sabão";

  // Serializa o objeto JSON e envia via Serial
  serializeJson(jsonDoc, Serial);
  Serial.println(); // Nova linha para facilitar a leitura

  // Pausa para evitar leituras muito rápidas
  delay(1000);
}
