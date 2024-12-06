import NavBarPainel from "../components/NavBarPainel";
import Banheiro from "../components/Banheiro";
import SensorChartsCacetada from "../components/Grafico"; // Importando o novo componente
import { useEffect, useState } from "react";
import axios from "axios";

export default function Painel() {
  const [sensores, setSensores] = useState([]); // Estado para armazenar sensores
  const [error, setError] = useState(null);

  // Lista de tipos de sensores permitidos
  const allowedSensorTypes = ["Umidade", "Papel", "Sabao"];

  // Função para buscar os sensores cadastrados
  const fetchSensores = async () => {
    try {
      const response = await axios.get("http://localhost:3000/sensores"); // API que retorna os sensores

      // Filtra os sensores com base nos tipos permitidos
      const sensorNames = Object.values(response.data)
        .filter((sensor) => allowedSensorTypes.includes(sensor.Tipo_Sensor))
        .map((sensor) => ({
          ID_Sensor: sensor.ID_Sensor,
          Nome_Sensor: sensor.Tipo_Sensor, // Supondo que "Tipo_Sensor" seja o nome do sensor
        }));

      setSensores(sensorNames); // Armazena os sensores filtrados com o nome e ID
      setError(null); // Limpa erros ao carregar com sucesso
    } catch (error) {
      console.error("Erro ao buscar sensores:", error);
      setError("Erro ao carregar sensores.");
    }
  };

  // Efeito para atualizar os sensores automaticamente a cada 5 segundos
  useEffect(() => {
    fetchSensores(); // Busca inicial
    const interval = setInterval(fetchSensores, 5000); // Atualiza a cada 5 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
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
              <SensorChartsCacetada
                sensorId={sensor.ID_Sensor} // Passando o ID do sensor
                sensorType={sensor.Nome_Sensor} // Passando o tipo do sensor
              />
            </div>
          ))
        ) : (
          <p>Carregando gráficos...</p>
        )}
      </div>
    </>
  );
}
