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
    Tipo_Sensor ENUM('Umidade','Temperatura', 'Sabão', 'Lixeira', 'Papel') NOT NULL,
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

INSERT INTO Sensor (ID_Sensor, Tipo_Sensor)
VALUES (5, 'Sabão');

-- Atualizar a tabela Sensor_Historico
CREATE TABLE Sensor_Historico (
    ID_Historico INT AUTO_INCREMENT PRIMARY KEY,
    ID_Sensor INT NOT NULL,
    Tipo_Sensor ENUM('Umidade', 'Temperatura', 'Sabão', 'Lixeira', 'Papel') NOT NULL,
    Historico_Periodo ENUM('Dia', 'Semana', 'Mes', 'Ano') NOT NULL,
    Resultado DECIMAL(5, 2),
    Data_Timestamp DATETIME NOT NULL,
    FOREIGN KEY (ID_Sensor) REFERENCES Sensor(ID_Sensor) ON DELETE CASCADE
);

-- Atualizar a tabela Sensor_Logs para incluir o tipo do sensor
CREATE TABLE Sensor_Logs (
    ID_Log INT AUTO_INCREMENT PRIMARY KEY,
    ID_Sensor INT NOT NULL,
    Tipo_Sensor ENUM('Umidade', 'Temperatura', 'Sabão', 'Lixeira', 'Papel') NOT NULL,
    Resultado_Atual DECIMAL(5, 2),
    Data_Timestamp DATETIME,
    FOREIGN KEY (ID_Sensor) REFERENCES Sensor(ID_Sensor) ON DELETE CASCADE
);

-- Exemplos

-- Listar Sensores em um Banheiro

SELECT * FROM Sensor;

SELECT * FROM User;

DELIMITER $$

CREATE TRIGGER AtualizarSensorHistorico
AFTER INSERT ON Sensor_Logs
FOR EACH ROW
BEGIN
    -- Atualizar ou inserir histórico diário
    INSERT INTO Sensor_Historico (ID_Sensor, Tipo_Sensor, Historico_Periodo, Resultado, Data_Timestamp)
    VALUES (NEW.ID_Sensor, NEW.Tipo_Sensor, 'Dia', NEW.Resultado_Atual, DATE(NEW.Data_Timestamp))
    ON DUPLICATE KEY UPDATE
        Resultado = (Resultado + NEW.Resultado_Atual) / 2,
        Data_Timestamp = NOW();

    -- Atualizar ou inserir histórico semanal
    INSERT INTO Sensor_Historico (ID_Sensor, Tipo_Sensor, Historico_Periodo, Resultado, Data_Timestamp)
    VALUES (NEW.ID_Sensor, NEW.Tipo_Sensor, 'Semana', NEW.Resultado_Atual, DATE(NEW.Data_Timestamp - INTERVAL WEEKDAY(NEW.Data_Timestamp) DAY))
    ON DUPLICATE KEY UPDATE
        Resultado = (Resultado + NEW.Resultado_Atual) / 2,
        Data_Timestamp = NOW();

    -- Atualizar ou inserir histórico mensal
    INSERT INTO Sensor_Historico (ID_Sensor, Tipo_Sensor, Historico_Periodo, Resultado, Data_Timestamp)
    VALUES (NEW.ID_Sensor, NEW.Tipo_Sensor, 'Mes', NEW.Resultado_Atual, DATE_FORMAT(NEW.Data_Timestamp, '%Y-%m-01'))
    ON DUPLICATE KEY UPDATE
        Resultado = (Resultado + NEW.Resultado_Atual) / 2,
        Data_Timestamp = NOW();

    -- Atualizar ou inserir histórico anual
    INSERT INTO Sensor_Historico (ID_Sensor, Tipo_Sensor, Historico_Periodo, Resultado, Data_Timestamp)
    VALUES (NEW.ID_Sensor, NEW.Tipo_Sensor, 'Ano', NEW.Resultado_Atual, DATE_FORMAT(NEW.Data_Timestamp, '%Y-01-01'))
    ON DUPLICATE KEY UPDATE
        Resultado = (Resultado + NEW.Resultado_Atual) / 2,
        Data_Timestamp = NOW();
END $$

DELIMITER ;
