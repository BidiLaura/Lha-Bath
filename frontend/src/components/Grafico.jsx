import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrando os componentes necessários para o Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SensorChartsCacetada({ sensorId, sensorType }) {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const periods = ["Diario", "Semanal", "Mensal", "Anual"];
  const allowedSensorTypes = ["Umidade", "Papel", "Sabao"]; // Tipos permitidos

  useEffect(() => {
    // Ignorar sensores que não estão na lista permitida
    if (!allowedSensorTypes.includes(sensorType)) {
      setErrors({ global: "Tipo de sensor não suportado para gráficos." });
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true); // Inicia o estado de carregamento
      let dataCache = {};

      for (let period of periods) {
        try {
          // Verifica se os dados já estão no cache
          if (!dataCache[period]) {
            const response = await axios.get(
              `http://localhost:3000/sensor-history/${period}/${sensorId}`,
              { params: { type: sensorType } }
            );

            // Formata os dados para Chart.js
            const labels = response.data.map((_, index) => `${index + 1}`);
            const values = response.data.map((item) => item.Resultado);

            dataCache[period] = {
              labels,
              datasets: [
                {
                  label: `Média (${period})`,
                  data: values,
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                },
              ],
            };
          }
        } catch (error) {
          setErrors((prev) => ({
            ...prev,
            [period]: "Erro ao carregar os dados.",
          }));
          console.error(`Erro ao carregar os dados de ${period}:`, error);
        }
      }

      setChartData(dataCache);
      setLoading(false); // Finaliza o carregamento
    };

    fetchData();
  }, [sensorId, sensorType]);

  // Estilo responsivo
  const containerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  };

  return (
    <div>
      <h3>Gráficos do Sensor: {sensorType}</h3>
      {loading ? (
        <p>Carregando gráficos...</p>
      ) : errors.global ? (
        <p style={{ color: "red" }}>{errors.global}</p>
      ) : (
        <div style={containerStyle}>
          {periods.map((period) => (
            <div key={period}>
              <h4>{`Histórico ${period.charAt(0).toUpperCase() + period.slice(1)}`}</h4>
              {errors[period] ? (
                <p style={{ color: "red" }}>{errors[period]}</p>
              ) : (
                <Bar
                  data={chartData[period]}
                  options={{
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: `Gráfico de Média (${period})`,
                      },
                      legend: {
                        position: "top",
                      },
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: "Período",
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: "Média",
                        },
                      },
                    },
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
