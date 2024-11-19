const int butao1 = 2;
const int butao2 = 3;
const int butao3 = 4;
const int pinoDHT11 = A2

dht DHT;

int contador = 0; 

void setup() {
  Serial.begin(9600);
  pinMode(butao1, INPUT);
  pinMode(butao2, INPUT);
  pinMode(butao3, INPUT);
  Serial.print("contador");
}

void loop() {

if (digitalRead(butao1) == HIGH){
  contador += 1;
}
else if (digitalRead(butao2) == HIGH){
  contador = 0;
}
else if (digitalRead(butao3) == HIGH){
  contador -= 1;
}

DHT.read11(pinoDHT11); //LÊ AS INFORMAÇÕES DO SENSOR
Serial.print("Umidade: "); //IMPRIME O TEXTO NA SERIAL
Serial.print(DHT.humidity); //IMPRIME NA SERIAL O VALOR DE UMIDADE MEDIDO
Serial.print("%"); //ESCREVE O TEXTO EM SEGUIDA
Serial.print(" / Temperatura: "); //IMPRIME O TEXTO NA SERIAL
Serial.print(DHT.temperature, 0); //IMPRIME NA SERIAL O VALOR DE UMIDADE MEDIDO E REMOVE A PARTE DECIMAL
Serial.println("*C"); //IMPRIME O TEXTO NA SERIAL

Serial.println(contador);
delay(1000);
}