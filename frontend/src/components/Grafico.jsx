import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Registrando os componentes necessários para o Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SensorChartsCacetada = ({ sensorId, sensorName }) => { // Adicionando sensorName como prop
  const [dailyData, setDailyData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [yearlyData, setYearlyData] = useState(null);

  useEffect(() => {
    const fetchChartData = async (endpoint, setter) => {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();

        const labels = data.map((_, index) => `${index + 1}`);
        const values = data.map((item) => item.Resultado);

        setter({
          labels,
          datasets: [
            {
              label: "Média",
              data: values,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });
      } catch (error) {
        console.error("Erro ao buscar dados do gráfico:", error);
      }
    };

    fetchChartData(`/sensor-history/daily/${sensorId}`, setDailyData);
    fetchChartData(`/sensor-history/weekly/${sensorId}`, setWeeklyData);
    fetchChartData(`/sensor-history/monthly/${sensorId}`, setMonthlyData);
    fetchChartData(`/sensor-history/yearly/${sensorId}`, setYearlyData);
  }, [sensorId]);

  return (
    <div className="chart-wrapper">
      <h3>Histórico do Sensor: {sensorName}</h3> {/* Exibindo o nome do sensor */}
      <div className="sensor-charts">
        <div>
          <h4>Diário</h4>
          {dailyData ? (
            <Bar
              data={dailyData}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Média Diária",
                  },
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
          ) : (
            <p>Carregando...</p>
          )}
        </div>
        <div>
          <h4>Semanal</h4>
          {weeklyData ? (
            <Bar
              data={weeklyData}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Média Semanal",
                  },
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
          ) : (
            <p>Carregando...</p>
          )}
        </div>
        <div>
          <h4>Mensal</h4>
          {monthlyData ? (
            <Bar
              data={monthlyData}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Média Mensal",
                  },
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
          ) : (
            <p>Carregando...</p>
          )}
        </div>
        <div>
          <h4>Anual</h4>
          {yearlyData ? (
            <Bar
              data={yearlyData}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Média Anual",
                  },
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
          ) : (
            <p>Carregando...</p>
          )}
        </div>
      </div>
    </div>
  );  
};

export default SensorChartsCacetada;
