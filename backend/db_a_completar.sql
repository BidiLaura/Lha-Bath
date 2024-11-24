CREATE DATABASE testeArduino;

USE testeArduino;

CREATE TABLE contador(
numeros INT NOT NULL PRIMARY KEY
)

SELECT * FROM contador;

CREATE TABLE Painel (
    ID_Painel INT AUTO_INCREMENT PRIMARY KEY,
    Notificacao VARCHAR(500),
    Avisos VARCHAR(500),
    Secao_localidade VARCHAR(30),
    Calendario DATETIME
);

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

CREATE TABLE Estoque (
    ID_centra_estoquel INT AUTO_INCREMENT PRIMARY KEY,
    Estoque_Papel VARCHAR(10),
    Estoque_Sabao VARCHAR(10),
    ID_Painel INT,
    FOREIGN KEY (ID_Painel) REFERENCES Painel(ID_Painel) ON DELETE CASCADE
);

--  tabela sensores

CREATE TABLE Sensor_humi_temp (
    ID_HTSen INT AUTO_INCREMENT PRIMARY KEY,
    Local VARCHAR(30),
    Resultado_Humi DECIMAL(5, 2),
    Resultado_Temp DECIMAL(5, 2),
    Historico_Dia DECIMAL(5, 2),
    Historico_Semana DECIMAL(5, 2),
    Historico_Mes DECIMAL(5, 2),
    Historico_Ano DECIMAL(5, 2),
    ID_Painel INT,
    FOREIGN KEY (ID_Painel) REFERENCES Painel(ID_Painel) ON DELETE CASCADE
);

CREATE TABLE SabaoSensor (
    ID_SabSen INT AUTO_INCREMENT PRIMARY KEY,
    Local VARCHAR(30),
    Resultado_Peso DECIMAL(5, 2),
    Historico_Dia DECIMAL(5, 2),
    Historico_Semana DECIMAL(5, 2),
    Historico_Mes DECIMAL(5, 2),
    Historico_Ano DECIMAL(5, 2),
    ID_Painel INT,
    ID_centra_estoquel INT,
    FOREIGN KEY (ID_Painel) REFERENCES Painel(ID_Painel) ON DELETE CASCADE,
    FOREIGN KEY (ID_centra_estoquel) REFERENCES Estoque(ID_centra_estoquel) ON DELETE CASCADE
);

CREATE TABLE Sensor_lixeira (
    ID_LixSen INT AUTO_INCREMENT PRIMARY KEY,
    Local VARCHAR(30),
    Resultado_Infraver BOOL,
    Historico_Dia DECIMAL(5, 2),
    Historico_Semana DECIMAL(5, 2),
    Historico_Mes DECIMAL(5, 2),
    Historico_Ano DECIMAL(5, 2),
    ID_Painel INT,
    FOREIGN KEY (ID_Painel) REFERENCES Painel(ID_Painel) ON DELETE CASCADE
);

CREATE TABLE PapelSensor (
    ID_PapSen INT AUTO_INCREMENT PRIMARY KEY,
    Local VARCHAR(30),
    Resultado_Ultra DECIMAL(5, 2),
    Historico_Dia DECIMAL(5, 2),
    Historico_Semana DECIMAL(5, 2),
    Historico_Mes DECIMAL(5, 2),
    Historico_Ano DECIMAL(5, 2),
    ID_Painel INT,
    ID_centra_estoquel INT,
    FOREIGN KEY (ID_Painel) REFERENCES Painel(ID_Painel) ON DELETE CASCADE,
    FOREIGN KEY (ID_centra_estoquel) REFERENCES Estoque(ID_centra_estoquel) ON DELETE CASCADE
);

--  tabela de logs para armazenar as leituras
CREATE TABLE Sensor_Logs (
    ID_Log INT AUTO_INCREMENT PRIMARY KEY,
    ID_Sensor INT,
    Tipo_Sensor VARCHAR(20), --  distinguir tipos de sensores
    Resultado_Atual DECIMAL(5, 2),
    Data_Timestamp DATETIME,
    FOREIGN KEY (ID_Sensor) REFERENCES Sensor_humi_temp(ID_HTSen) ON DELETE CASCADE --  Exemplo para o primeiro sensor
);

--  melhorar consultas
CREATE INDEX idx_sensor_logs_sensor_id ON Sensor_Logs(ID_Sensor);
CREATE INDEX idx_sensor_logs_timestamp ON Sensor_Logs(Data_Timestamp);

--  Triggers

--  dia
DELIMITER $$

CREATE TRIGGER update_daily_history
AFTER INSERT ON Sensor_Logs
FOR EACH ROW
BEGIN
    --  Sensor_humi_temp
    IF NEW.Tipo_Sensor = 'humi_temp' THEN
        UPDATE Sensor_humi_temp
        SET Historico_Dia = (
            SELECT AVG(Resultado_Atual)
            FROM Sensor_Logs
            WHERE ID_Sensor = NEW.ID_Sensor
            AND Tipo_Sensor = 'humi_temp'
            AND DATE(Data_Timestamp) = CURDATE()
        )
        WHERE ID_HTSen = NEW.ID_Sensor;
    END IF;

    --  SabaoSensor
    IF NEW.Tipo_Sensor = 'sabao' THEN
        UPDATE SabaoSensor
        SET Historico_Dia = (
            SELECT AVG(Resultado_Atual)
            FROM Sensor_Logs
            WHERE ID_Sensor = NEW.ID_Sensor
            AND Tipo_Sensor = 'sabao'
            AND DATE(Data_Timestamp) = CURDATE()
        )
        WHERE ID_SabSen = NEW.ID_Sensor;
    END IF;

    -- Sensor_lixeira
    IF NEW.Tipo_Sensor = 'lixeira' THEN
        UPDATE Sensor_lixeira
        SET Historico_Dia = (
            SELECT AVG(Resultado_Atual)
            FROM Sensor_Logs
            WHERE ID_Sensor = NEW.ID_Sensor
            AND Tipo_Sensor = 'lixeira'
            AND DATE(Data_Timestamp) = CURDATE()
        )
        WHERE ID_LixSen = NEW.ID_Sensor;
    END IF;

    -- PapelSensor
    IF NEW.Tipo_Sensor = 'papel' THEN
        UPDATE PapelSensor
        SET Historico_Dia = (
            SELECT AVG(Resultado_Atual)
            FROM Sensor_Logs
            WHERE ID_Sensor = NEW.ID_Sensor
            AND Tipo_Sensor = 'papel'
            AND DATE(Data_Timestamp) = CURDATE()
        )
        WHERE ID_PapSen = NEW.ID_Sensor;
    END IF;

END $$

DELIMITER ;

-- semana
DELIMITER $$

CREATE TRIGGER update_weekly_history
AFTER INSERT ON Sensor_Logs
FOR EACH ROW
BEGIN
    -- Sensor_humi_temp
    IF NEW.Tipo_Sensor = 'humi_temp' THEN
        UPDATE Sensor_humi_temp
        SET Historico_Semana = (
            SELECT AVG(Resultado_Atual)
            FROM Sensor_Logs
            WHERE ID_Sensor = NEW.ID_Sensor
            AND Tipo_Sensor = 'humi_temp'
            AND YEARWEEK(Data_Timestamp, 1) = YEARWEEK(CURDATE(), 1)
        )
        WHERE ID_HTSen = NEW.ID_Sensor;
    END IF;

    -- SabaoSensor
    IF NEW.Tipo_Sensor = 'sabao' THEN
        UPDATE SabaoSensor
        SET Historico_Semana = (
            SELECT AVG(Resultado_Atual)
            FROM Sensor_Logs
            WHERE ID_Sensor = NEW.ID_Sensor
            AND Tipo_Sensor = 'sabao'
            AND YEARWEEK(Data_Timestamp, 1) = YEARWEEK(CURDATE(), 1)
        )
        WHERE ID_SabSen = NEW.ID_Sensor;
    END IF;

    -- Sensor_lixeira
    IF NEW.Tipo_Sensor = 'lixeira' THEN
        UPDATE Sensor_lixeira
        SET Historico_Semana = (
            SELECT AVG(Resultado_Atual)
            FROM Sensor_Logs
            WHERE ID_Sensor = NEW.ID_Sensor
            AND Tipo_Sensor = 'lixeira'
            AND YEARWEEK(Data_Timestamp, 1) = YEARWEEK(CURDATE(), 1)
        )
        WHERE ID_LixSen = NEW.ID_Sensor;
    END IF;

    -- PapelSensor
    IF NEW.Tipo_Sensor = 'papel' THEN
        UPDATE PapelSensor
        SET Historico_Semana = (
            SELECT AVG(Resultado_Atual)
            FROM Sensor_Logs
            WHERE ID_Sensor = NEW.ID_Sensor
            AND Tipo_Sensor = 'papel'
            AND YEARWEEK(Data_Timestamp, 1) = YEARWEEK(CURDATE(), 1)
        )
        WHERE ID_PapSen = NEW.ID_Sensor;
    END IF;

END $$

DELIMITER ;

-- mes
DELIMITER $$

CREATE TRIGGER update_monthly_history
AFTER INSERT ON Sensor_Logs
FOR EACH ROW
BEGIN
    -- Sensor_humi_temp
    IF NEW.Tipo_Sensor = 'humi_temp' THEN
        UPDATE Sensor_humi_temp
        SET Historico_Mes = (
            SELECT AVG(Resultado_Atual)
            FROM Sensor_Logs
            WHERE ID_Sensor = NEW.ID_Sensor
            AND Tipo_Sensor = 'humi_temp'
            AND YEAR(Data_Timestamp) = YEAR(CURDATE())
            AND MONTH(Data_Timestamp) = MONTH(CURDATE())
        )
        WHERE ID_HTSen = NEW.ID_Sensor;
    END IF;

    -- SabaoSensor
    IF NEW.Tipo_Sensor = 'sabao' THEN
        UPDATE SabaoSensor
        SET Historico_Mes = (
            SELECT AVG(Resultado_Atual)
            FROM Sensor_Logs
            WHERE ID_Sensor = NEW.ID_Sensor
            AND Tipo_Sensor = 'sabao'
            AND YEAR(Data_Timestamp) = YEAR(CURDATE())
            AND MONTH(Data_Timestamp) = MONTH(CURDATE())
        )
        WHERE ID_SabSen = NEW.ID_Sensor;
    END IF;

    -- Sensor_lixeira
    IF NEW.Tipo_Sensor = 'lixeira' THEN
        UPDATE Sensor_lixeira
        SET Historico_Mes = (
            SELECT AVG(Resultado_Atual)
            FROM Sensor_Logs
            WHERE ID_Sensor = NEW.ID_Sensor
            AND Tipo_Sensor = 'lixeira'
            AND YEAR(Data_Timestamp) = YEAR(CURDATE())
            AND MONTH(Data_Timestamp) = MONTH(CURDATE())
        )
        WHERE ID_LixSen = NEW.ID_Sensor;
    END IF;

    -- PapelSensor
    IF NEW.Tipo_Sensor = 'papel' THEN
        UPDATE PapelSensor
        SET Historico_Mes = (
            SELECT AVG(Resultado_Atual)
            FROM Sensor_Logs
            WHERE ID_Sensor = NEW.ID_Sensor
            AND Tipo_Sensor = 'papel'
            AND YEAR(Data_Timestamp) = YEAR(CURDATE())
            AND MONTH(Data_Timestamp) = MONTH(CURDATE())
        )
        WHERE ID_PapSen = NEW.ID_Sensor;
    END IF;

END $$

DELIMITER ;

-- ano
DELIMITER $$

CREATE TRIGGER update_yearly_history
AFTER INSERT ON Sensor_Logs
FOR EACH ROW
BEGIN
    -- Sensor_humi_temp
    IF NEW.Tipo_Sensor = 'humi_temp' THEN
        UPDATE Sensor_humi_temp
        SET Historico_Ano = (
            SELECT AVG(Resultado_Atual)
            FROM Sensor_Logs
            WHERE ID_Sensor = NEW.ID_Sensor
            AND Tipo_Sensor = 'humi_temp'
            AND YEAR(Data_Timestamp) = YEAR(CURDATE())
        )
        WHERE ID_HTSen = NEW.ID_Sensor;
    END IF;

    -- SabaoSensor
    IF NEW.Tipo_Sensor = 'sabao' THEN
        UPDATE SabaoSensor
        SET Historico_Ano = (
            SELECT AVG(Resultado_Atual)
            FROM Sensor_Logs
            WHERE ID_Sensor = NEW.ID_Sensor
            AND Tipo_Sensor = 'sabao'
            AND YEAR(Data_Timestamp) = YEAR(CURDATE())
        )
        WHERE ID_SabSen = NEW.ID_Sensor;
    END IF;

    -- Sensor_lixeira
    IF NEW.Tipo_Sensor = 'lixeira' THEN
        UPDATE Sensor_lixeira
        SET Historico_Ano = (
            SELECT AVG(Resultado_Atual)
            FROM Sensor_Logs
            WHERE ID_Sensor = NEW.ID_Sensor
            AND Tipo_Sensor = 'lixeira'
            AND YEAR(Data_Timestamp) = YEAR(CURDATE())
        )
        WHERE ID_LixSen = NEW.ID_Sensor;
    END IF;

    -- PapelSensor
    IF NEW.Tipo_Sensor = 'papel' THEN
        UPDATE PapelSensor
        SET Historico_Ano = (
            SELECT AVG(Resultado_Atual)
            FROM Sensor_Logs
            WHERE ID_Sensor = NEW.ID_Sensor
            AND Tipo_Sensor = 'papel'
            AND YEAR(Data_Timestamp) = YEAR(CURDATE())
        )
        WHERE ID_PapSen = NEW.ID_Sensor;
    END IF;

END $$

DELIMITER ;
