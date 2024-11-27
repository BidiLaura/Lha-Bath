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
    Login VARCHAR(20) NOT NULL,
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
    Tipo_Sensor ENUM('HumiTemp', 'Sabao', 'Lixeira', 'Papel') NOT NULL,
    Local VARCHAR(30),
    Resultado_Atual DECIMAL(5, 2),
    ID_Banheiro INT,
    FOREIGN KEY (ID_Banheiro) REFERENCES Banheiro(ID_Banheiro) ON DELETE CASCADE
);

-- Tabela de Históricos de Sensores
CREATE TABLE Sensor_Historico (
    ID_Historico INT AUTO_INCREMENT PRIMARY KEY,
    ID_Sensor INT NOT NULL,
    Historico_Periodo ENUM('Dia', 'Semana', 'Mes', 'Ano') NOT NULL,
    Resultado DECIMAL(5, 2),
    Data_Timestamp DATETIME NOT NULL,
    FOREIGN KEY (ID_Sensor) REFERENCES Sensor(ID_Sensor) ON DELETE CASCADE
);

-- Tabela de Logs de Sensores
CREATE TABLE Sensor_Logs (
    ID_Log INT AUTO_INCREMENT PRIMARY KEY,
    ID_Sensor INT NOT NULL,
    Resultado_Atual DECIMAL(5, 2),
    Data_Timestamp DATETIME,
    FOREIGN KEY (ID_Sensor) REFERENCES Sensor(ID_Sensor) ON DELETE CASCADE
);

-- Exemplos

-- Listar Sensores em um Banheiro

SELECT S.Tipo_Sensor, S.Local, S.Resultado_Atual
FROM Sensor S
JOIN Banheiro B ON S.ID_Banheiro = B.ID_Banheiro
WHERE B.Nome = 'Banheiro 1';

-- Inserir Histórico para um Sensor
INSERT INTO Sensor_Historico (ID_Sensor, Historico_Periodo, Resultado, Data_Timestamp)
VALUES (1, 'Dia', 23.5, NOW());

-- Listar Usuários e Seus Painéis
SELECT U.Nome, P.Secao_localidade, P.Notificacao
FROM User U
JOIN Painel P ON U.ID_Painel = P.ID_Painel;

-- Estoque de um Painel
SELECT E.Estoque_Papel, E.Estoque_Sabao
FROM Estoque E
JOIN Painel P ON E.ID_Painel = P.ID_Painel
WHERE P.ID_Painel = 1;

-- Triggers

-- Diario
DELIMITER $$

CREATE TRIGGER update_daily_history
AFTER INSERT ON Sensor_Logs
FOR EACH ROW
BEGIN
    INSERT INTO Sensor_Historico (ID_Sensor, Historico_Periodo, Resultado, Data_Timestamp)
    VALUES (
        NEW.ID_Sensor,
        'Dia',
        (SELECT AVG(Resultado_Atual)
         FROM Sensor_Logs
         WHERE ID_Sensor = NEW.ID_Sensor
         AND DATE(Data_Timestamp) = CURDATE()),
        NOW()
    )
    ON DUPLICATE KEY UPDATE Resultado = VALUES(Resultado), Data_Timestamp = VALUES(Data_Timestamp);
END $$

DELIMITER ;

-- Semanal
DELIMITER $$

CREATE TRIGGER update_weekly_history
AFTER INSERT ON Sensor_Logs
FOR EACH ROW
BEGIN
    INSERT INTO Sensor_Historico (ID_Sensor, Historico_Periodo, Resultado, Data_Timestamp)
    VALUES (
        NEW.ID_Sensor,
        'Semana',
        (SELECT AVG(Resultado_Atual)
         FROM Sensor_Logs
         WHERE ID_Sensor = NEW.ID_Sensor
         AND YEARWEEK(Data_Timestamp, 1) = YEARWEEK(CURDATE(), 1)),
        NOW()
    )
    ON DUPLICATE KEY UPDATE Resultado = VALUES(Resultado), Data_Timestamp = VALUES(Data_Timestamp;
END $$

DELIMITER ;

-- Mensal
DELIMITER $$

CREATE TRIGGER update_monthly_history
AFTER INSERT ON Sensor_Logs
FOR EACH ROW
BEGIN
    INSERT INTO Sensor_Historico (ID_Sensor, Historico_Periodo, Resultado, Data_Timestamp)
    VALUES (
        NEW.ID_Sensor,
        'Mes',
        (SELECT AVG(Resultado_Atual)
         FROM Sensor_Logs
         WHERE ID_Sensor = NEW.ID_Sensor
         AND YEAR(Data_Timestamp) = YEAR(CURDATE())
         AND MONTH(Data_Timestamp) = MONTH(CURDATE())),
        NOW()
    )
    ON DUPLICATE KEY UPDATE Resultado = VALUES(Resultado), Data_Timestamp = VALUES(Data_Timestamp);
END $$

DELIMITER ;

-- Anual
DELIMITER $$

CREATE TRIGGER update_yearly_history
AFTER INSERT ON Sensor_Logs
FOR EACH ROW
BEGIN
    INSERT INTO Sensor_Historico (ID_Sensor, Historico_Periodo, Resultado, Data_Timestamp)
    VALUES (
        NEW.ID_Sensor,
        'Ano',
        (SELECT AVG(Resultado_Atual)
         FROM Sensor_Logs
         WHERE ID_Sensor = NEW.ID_Sensor
         AND YEAR(Data_Timestamp) = YEAR(CURDATE())),
        NOW()
    )
    ON DUPLICATE KEY UPDATE Resultado = VALUES(Resultado), Data_Timestamp = VALUES(Data_Timestamp);
END $$

DELIMITER ;
