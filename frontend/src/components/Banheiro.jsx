import React, { useEffect, useState } from "react";
import axios from "axios";

const Banheiro = () => {
  const [sensores, setSensores] = useState(null); // Estado para armazenar os sensores
  const [error, setError] = useState(null);

  const fetchSensores = async () => {
    try {
      const response = await axios.get("http://localhost:3000/sensores"); // Requisição para pegar os dados dos sensores
      console.log("Sensores recebidos:", response.data);
      setSensores(response.data); // Armazena os dados recebidos
    } catch (error) {
      console.error("Erro ao buscar sensores:", error);
      setError("Erro ao carregar sensores.");
    }
  };

  useEffect(() => {
    fetchSensores(); // Chama a função para buscar os sensores na montagem do componente
  }, []);

  if (!sensores) {
    return <div>Carregando sensores...</div>; // Exibe enquanto os dados não são carregados
  }

  return (
    <div className="sensor-container">
      <h2>Sensores do Banheiro</h2>
      <div className="sensor-content">
        {error && <div style={{ color: "red" }}>{error}</div>}

        {/* Verificando se cada sensor existe antes de acessar seus dados */}
        {sensores.sensor_1 && (
          <div className="sensor">
            <h5>{sensores.sensor_1.Tipo_Sensor}</h5>
            <p><strong>Resultado Atual:</strong> {sensores.sensor_1.Resultado_Atual}</p>
          </div>
        )}

        {sensores.sensor_2 && (
          <div className="sensor">
            <h5>{sensores.sensor_2.Tipo_Sensor}</h5>
            <p><strong>Resultado Atual:</strong> {sensores.sensor_2.Resultado_Atual}</p>
          </div>
        )}

        {sensores.sensor_3 && (
          <div className="sensor">
            <h5>{sensores.sensor_3.Tipo_Sensor}</h5>
            <p><strong>Resultado Atual:</strong> {sensores.sensor_3.Resultado_Atual}</p>
          </div>
        )}

        {sensores.sensor_4 && (
          <div className="sensor">
            <h5>{sensores.sensor_4.Tipo_Sensor}</h5>
            <p><strong>Resultado Atual:</strong> {sensores.sensor_4.Resultado_Atual}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Banheiro;
