import React, { useEffect, useState } from "react";
import axios from "axios";
import Sensor from "./Sensor"; // Componente que exibirá os sensores

const BanheiroSensores = ({ id }) => {
  const [sensores, setSensores] = useState([]); // Estado para armazenar os sensores
  const [error, setError] = useState(null); // Estado para mensagens de erro

  // Função para buscar os sensores do banco
  const fetchSensores = async () => {
    try {
      const response = await axios.get(`/sensores/${id}`); // A API agora retorna todos os sensores
      setSensores(response.data); // Armazena os sensores encontrados
    } catch (error) {
      console.error("Erro ao buscar sensores:", error);
      setError("Erro ao carregar sensores.");
    }
  };

  // Chama a função fetchSensores assim que o componente for montado
  useEffect(() => {
    fetchSensores();
  }, [id]); // Reexecuta a busca sempre que o ID mudar

  return (
    <div className="sensor-container">
      <div className="sensor-header">
        <h2>Sensores do Banheiro</h2>
      </div>
      <div className="sensor-content">
        {error && <div style={{ color: "red" }}>{error}</div>}

        {/* Exibe os sensores */}
        {sensores.length === 0 ? (
          <div>Sem sensores cadastrados para este banheiro.</div>
        ) : (
          sensores.map((sensor) => (
            <Sensor key={sensor.ID_Sensor} sensor={sensor} />
          ))
        )}
      </div>
    </div>
  );
};

export default BanheiroSensores;
