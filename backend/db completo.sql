DROP DATABASE Lhabath;

CREATE DATABASE Lhabath;

USE Lhabath;

-- Tabela de Painéis
CREATE TABLE Painel (
    ID_Painel INT AUTO_INCREMENT PRIMARY KEY,
    Notificacao VARCHAR(500),
    Avisos VARCHAR(500),
    Secao_localidade VARCHAR(30),
    Calendario DATETIME
);

-- Tabela de Usuários
CREATE TABLE User (
    ID_User INT AUTO_INCREMENT PRIMARY KEY,
    CNPJ VARCHAR(14) NOT NULL,
    Telefone VARCHAR(20) NOT NULL,
    Email VARCHAR(40) NOT NULL,
    Senha VARCHAR(255) NOT NULL,
    Nome VARCHAR(70) NOT NULL,
    ID_Painel INT,
    FOREIGN KEY (ID_Painel) REFERENCES Painel(ID_Painel) ON DELETE SET NULL
);

-- Tabela de Estoque
CREATE TABLE Estoque (
    ID_Estoque INT AUTO_INCREMENT PRIMARY KEY,
    Estoque_Papel INT NOT NULL,
    Estoque_Sabao INT NOT NULL,
    ID_Painel INT,
    FOREIGN KEY (ID_Painel) REFERENCES Painel(ID_Painel) ON DELETE CASCADE
);

-- Tabela de Banheiros
CREATE TABLE Banheiro (
    ID_Banheiro INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(50) NOT NULL,
    Localizacao VARCHAR(100),
    ID_Painel INT,
    FOREIGN KEY (ID_Painel) REFERENCES Painel(ID_Painel) ON DELETE CASCADE
);

-- Tabela de Sensores Genéricos
CREATE TABLE Sensor (
    ID_Sensor INT AUTO_INCREMENT PRIMARY KEY,
    Tipo_Sensor ENUM('Umidade','Temperatura', 'Sabao', 'Lixeira', 'Papel') NOT NULL,
    Local VARCHAR(30),
    Resultado_Atual DECIMAL(5, 2),
    ID_Banheiro INT,
    FOREIGN KEY (ID_Banheiro) REFERENCES Banheiro(ID_Banheiro) ON DELETE CASCADE
);

-- Inserir dados de Humidade com ID 1
INSERT INTO Sensor (ID_Sensor, Tipo_Sensor)
VALUES (1, 'Umidade');

-- Inserir dados de Temperatura com ID 2
INSERT INTO Sensor (ID_Sensor, Tipo_Sensor)
VALUES (2, 'Temperatura');

-- Inserir dados de Distância (Papel) com ID 3
INSERT INTO Sensor (ID_Sensor, Tipo_Sensor)
VALUES (3, 'Papel');

-- Inserir dados de Lixeira com ID 4
INSERT INTO Sensor (ID_Sensor, Tipo_Sensor)
VALUES (4, 'Lixeira');

-- Atualizar a tabela Sensor_Historico
CREATE TABLE Sensor_Historico (
    ID_Historico INT AUTO_INCREMENT PRIMARY KEY,
    ID_Sensor INT NOT NULL,
    Tipo_Sensor ENUM('Umidade', 'Temperatura', 'Sabao', 'Lixeira', 'Papel') NOT NULL,
    Historico_Periodo ENUM('Dia', 'Semana', 'Mes', 'Ano') NOT NULL,
    Resultado DECIMAL(5, 2),
    Data_Timestamp DATETIME NOT NULL,
    FOREIGN KEY (ID_Sensor) REFERENCES Sensor(ID_Sensor) ON DELETE CASCADE
);

-- Atualizar a tabela Sensor_Logs para incluir o tipo do sensor
CREATE TABLE Sensor_Logs (
    ID_Log INT AUTO_INCREMENT PRIMARY KEY,
    ID_Sensor INT NOT NULL,
    Tipo_Sensor ENUM('Umidade', 'Temperatura', 'Sabao', 'Lixeira', 'Papel') NOT NULL,
    Resultado_Atual DECIMAL(5, 2),
    Data_Timestamp DATETIME,
    FOREIGN KEY (ID_Sensor) REFERENCES Sensor(ID_Sensor) ON DELETE CASCADE
);

-- Exemplos

-- Listar Sensores em um Banheiro

SELECT * FROM Sensor;

SELECT * FROM User;

-- Inserts para Sensor_Logs com dados de 1 mês
INSERT INTO Sensor_Logs (ID_Sensor, Resultado_Atual, Data_Timestamp) VALUES
(3, 98.2, '2024-11-01 08:00:00'),
(3, 96.5, '2024-11-01 12:00:00'),
(3, 92.3, '2024-11-01 18:00:00'),
(3, 89.7, '2024-11-02 09:00:00'),
(3, 85.2, '2024-11-02 15:00:00'),
(3, 82.5, '2024-11-03 10:00:00'),
(3, 80.0, '2024-11-03 14:30:00'),
(3, 77.3, '2024-11-03 20:00:00'),
(3, 75.0, '2024-11-04 08:00:00'),
(3, 70.6, '2024-11-04 12:45:00'),
(3, 68.4, '2024-11-05 09:15:00'),
(3, 65.2, '2024-11-05 16:20:00'),
(3, 62.1, '2024-11-06 08:00:00'),
(3, 60.0, '2024-11-06 19:00:00'),
(3, 58.3, '2024-11-07 12:30:00'),
(3, 55.7, '2024-11-07 17:00:00'),
(3, 50.2, '2024-11-08 08:00:00'),
(3, 48.5, '2024-11-08 14:00:00'),
(3, 46.2, '2024-11-09 10:15:00'),
(3, 42.0, '2024-11-09 20:00:00'),
(3, 40.1, '2024-11-10 12:00:00'),
(3, 35.8, '2024-11-10 18:30:00'),
(3, 32.3, '2024-11-11 09:00:00'),
(3, 30.0, '2024-11-11 14:15:00'),
(3, 28.2, '2024-11-12 08:45:00'),
(3, 25.5, '2024-11-12 19:30:00'),
(3, 20.0, '2024-11-13 13:00:00'),
(3, 15.2, '2024-11-14 11:45:00'),
(3, 10.5, '2024-11-15 10:30:00'),
(3, 5.0, '2024-11-16 09:15:00');



