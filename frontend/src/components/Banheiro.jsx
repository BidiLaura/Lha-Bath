import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaThermometerHalf,
  FaTint,
  FaTrash,
  FaToiletPaper,
  FaSoap, // Ícone de Sabão
} from "react-icons/fa";

const Banheiro = () => {
  const [sensores, setSensores] = useState(null);
  const [error, setError] = useState(null);

  const fetchSensores = async () => {
    try {
      const response = await axios.get("http://localhost:3000/sensores");
      setSensores(response.data);
      setError(null); // Limpa o erro se a solicitação for bem-sucedida
    } catch (error) {
      console.error("Erro ao carregar sensores:", error);
      setError("Erro ao carregar sensores.");
    }
  };

  useEffect(() => {
    fetchSensores(); // Busca inicial

    const interval = setInterval(fetchSensores, 5000); // Atualiza a cada 5 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, []);

  if (!sensores) {
    return <div>Carregando sensores...</div>;
  }

  const getSensorIcon = (type) => {
    switch (type) {
      case "Temperatura":
        return <FaThermometerHalf className="sensor-icon" />;
      case "Umidade":
        return <FaTint className="sensor-icon" />;
      case "Lixeira":
        return <FaTrash className="sensor-icon" />;
      case "Papel":
        return <FaToiletPaper className="sensor-icon" />;
      case "Sabao":
        return <FaSoap className="sensor-icon" />;
      default:
        return null;
    }
  };

  const getSensorWarning = (type, value) => {
    if (type === "Papel" && value < 5) {
      return "Atenção: Papel está acabando!";
    }
    if (type === "Lixeira" && value === 1) {
      return "Atenção: Lixeira está cheia!";
    }
    if (type === "Sabao" && value < 10) { 
      return "Atenção: Sabão está acabando!";
    }
    return null;
  };

  return (
    <div className="sensor-container">
      {error && <div style={{ color: "red" }}>{error}</div>}

      {Object.entries(sensores).map(([key, sensor]) => (
        <div key={key} className="sensor">
          {getSensorIcon(sensor.Tipo_Sensor)}
          <h5>{sensor.Tipo_Sensor}</h5>
          <p className="sensor-result">Resultado: {sensor.Resultado_Atual}</p>
          {getSensorWarning(sensor.Tipo_Sensor, sensor.Resultado_Atual) && (
            <p className="sensor-warning">
              {getSensorWarning(sensor.Tipo_Sensor, sensor.Resultado_Atual)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Banheiro;
