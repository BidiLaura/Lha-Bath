#include <Ultrasonic.h>

const int pinoDHT11 = A2;
const int pinoTrigger = 5;
const int pinoEcho = 4;
const int pinoInfra = 6;

dht DHT;

int contador = 0; 

void setup() {
  Serial.begin(9600);
  pinMode(pinoInfra, INPUT);
  Serial.print("Lha-Bath");
}

void loop() {
// sensor de umidade e temperatura
DHT.read11(pinoDHT11); 
Serial.print("Umidade: "); 
Serial.print(DHT.humidity); 
Serial.print("%"); 
Serial.print(" / Temperatura: "); 
Serial.print(DHT.temperature, 0); 
Serial.println("*C");
//sensor ultrassonico
float cmMsec, inMsec;
long microsec = ultrasonic.timing();
cmMsec = ultrasonic.convert(microsec, Ultrasonic::CM);
Serial.print("Distancia em cm: ");
Serial.print(cmMsec);
// sensor infra
int leitura;
int contador = 0;
leitura = digitalRead(pinosensor);
if (leitura != 1){
contador += 1;
}

Serial.println(contador);
}
