import React, { useEffect, useState } from "react";
import axios from "axios"; // Usaremos axios para realizar requisições HTTP

import Cabine from "./Cabine"; // Importando o componente Cabine
import Sensor from "./Sensor"; // Componente para representar o Sensor

const Banheiro = ({ id }) => {
  const [banheiro, setBanheiro] = useState(null); // Armazena as informações do banheiro
  const [isOpen, setIsOpen] = useState(false); // Controla a exibição do conteúdo do banheiro
  const [showSensorList, setShowSensorList] = useState(false); // Controla a exibição da lista de sensores
  const [selectedSensor, setSelectedSensor] = useState(null); // Armazena o sensor selecionado para adicionar

  // Função para buscar o banheiro do banco de dados usando seu ID
  const fetchBanheiro = async () => {
    try {
      const response = await axios.get(`/banheiros/${id}`);
      setBanheiro(response.data); // Definindo o estado do banheiro com os dados retornados
    } catch (error) {
      console.error("Erro ao buscar o banheiro:", error);
    }
  };

  // Função para adicionar cabines ao banheiro
  const addCabine = () => {
    setBanheiro((prevBanheiro) => {
      const newCabines = (prevBanheiro.Cabines || 0) + 1;  // Adiciona 1 cabine
      return { ...prevBanheiro, Cabines: newCabines };
    });
  };

  // Função para adicionar sensor ao banheiro
  const addSensor = (sensorTipo) => {
    setBanheiro((prevBanheiro) => {
      const newSensor = { tipo: sensorTipo, id: Math.random().toString(36).substr(2, 9) }; // Gerar ID aleatório para o sensor
      return { ...prevBanheiro, sensores: [...(prevBanheiro.sensores || []), newSensor] };
    });
    setShowSensorList(false); // Fechar a lista de sensores após adicionar
  };

  // Chama a função de buscar banheiro assim que o componente for montado
  useEffect(() => {
    fetchBanheiro();
  }, [id]);

  // Verifica se o banheiro foi carregado corretamente
  if (!banheiro) {
    return <div>Carregando banheiro...</div>;
  }

  const { Nome, Localizacao, Cabines, sensores = [] } = banheiro;

  return (
    <div className="banheiro-container">
      <div
        className="banheiro-header"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h2>{Nome}</h2>
        <span className={`arrow ${isOpen ? "open" : ""}`}>&#x25BC;</span> {/* seta */}
      </div>
      {isOpen && (
        <div className="banheiro-content">
          {/* Renderiza os sensores adicionados */}
          <div className="banheiro-sensores">
            <h4>Sensores:</h4>
            {sensores.length === 0 ? (
              <div>Sem sensores adicionados.</div>
            ) : (
              sensores.map((sensor) => (
                <Sensor key={sensor.id} tipo={sensor.tipo} />
              ))
            )}
          </div>

          {/* Renderiza o número de cabines com base no valor do banco */}
          {Array.from({ length: Cabines }).map((_, index) => (
            <Cabine key={index} number={index + 1} />
          ))}

          {/* Botões de ações */}
          <button onClick={addCabine}>Adicionar Cabine</button>

          {/* Botão para adicionar sensor */}
          <button onClick={() => setShowSensorList((prev) => !prev)}>
            {showSensorList ? "Fechar Lista de Sensores" : "Adicionar Sensor"}
          </button>

          {/* Lista de sensores para escolher */}
          {showSensorList && (
            <div className="sensor-list">
              <ul>
                <li onClick={() => addSensor('Sabão')}>Sabão</li>
                <li onClick={() => addSensor('Lixeira')}>Lixeira</li>
                <li onClick={() => addSensor('Temperatura e Humidade')}>Temperatura e Humidade</li>
                <li onClick={() => addSensor('Papel')}>Papel</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Banheiro;
