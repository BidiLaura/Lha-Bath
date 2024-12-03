import NavBarPainel from "../components/NavBarPainel";
import Banheiro from "../components/Banheiro";
import SensorChartsCacetada from "../components/Grafico"; // Importando o novo componente
import { useEffect, useState } from "react";
import axios from "axios";

export default function Painel() {
  const [sensores, setSensores] = useState([]); // Estado para armazenar sensores
  const [error, setError] = useState(null);

  // Função para buscar os sensores cadastrados
  const fetchSensores = async () => {
    try {
      const response = await axios.get("http://localhost:3000/sensores"); // API que retorna os sensores
      // Alteração para obter o nome do sensor em vez do ID
      const sensorNames = Object.values(response.data).map((sensor) => ({
        ID_Sensor: sensor.ID_Sensor,
        Nome_Sensor: sensor.Tipo_Sensor, // Supondo que "Tipo_Sensor" seja o nome do sensor
      }));
      setSensores(sensorNames); // Armazena os sensores com o nome e ID
    } catch (error) {
      console.error("Erro ao buscar sensores:", error);
      setError("Erro ao carregar sensores.");
    }
  };

  useEffect(() => {
    fetchSensores(); // Busca os sensores quando o componente é montado
  }, []);

  return (
    <>
      <NavBarPainel />
      <Banheiro />
      <div className="charts-container">
        <h2>Gráficos dos Sensores</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {sensores.length > 0 ? (
          sensores.map((sensor) => (
            <div key={sensor.ID_Sensor} className="chart-wrapper">
              <h3>Gráfico do Sensor {sensor.Nome_Sensor}</h3>
              <SensorChartsCacetada sensorId={sensor.ID_Sensor} /> {/* Passando o ID do sensor para o gráfico */}
            </div>
          ))
        ) : (
          <p>Carregando gráficos...</p>
        )}
      </div>
    </>
  );
}
