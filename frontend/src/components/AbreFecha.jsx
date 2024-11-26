import React, { useState } from 'react';
import '../index.css';

const ToggleDiv = () => {

  const [isOpenBanheiro1, setIsOpenBanheiro1] = useState(false);
  const [isOpenBanheiro2, setIsOpenBanheiro2] = useState(false);
  const [isOpenPapelBanheiro1, setIsOpenPapelBanheiro1] = useState(false);
  const [isOpenLixoBanheiro1, setIsOpenLixoBanheiro1] = useState(false);
  const [isOpenPapelBanheiro2, setIsOpenPapelBanheiro2] = useState(false);
  const [isOpenLixoBanheiro2, setIsOpenLixoBanheiro2] = useState(false);

  const toggleBanheiro1 = () => {
    setIsOpenBanheiro1(!isOpenBanheiro1);
  };

  const toggleBanheiro2 = () => {
    setIsOpenBanheiro2(!isOpenBanheiro2);
  };

  const togglePapelBanheiro1 = () => {
    setIsOpenPapelBanheiro1(!isOpenPapelBanheiro1);
  };

  const toggleLixoBanheiro1 = () => {
    setIsOpenLixoBanheiro1(!isOpenLixoBanheiro1);
  };

  const togglePapelBanheiro2 = () => {
    setIsOpenPapelBanheiro2(!isOpenPapelBanheiro2);
  };

  const toggleLixoBanheiro2 = () => {
    setIsOpenLixoBanheiro2(!isOpenLixoBanheiro2);
  };

  return (
    <>
      {/* Banheiro 1 */}
      <div className="toggle-container">
        <div className="toggle-section">
          <h2>Banheiro 1</h2>
          <button onClick={toggleBanheiro1} className="toggle-button">
            {isOpenBanheiro1 ? 'Fechar' : 'Ver'}
          </button>
        </div>

        <div className={`toggle-content ${isOpenBanheiro1 ? 'open' : ''}`}>
          <h3>Sabão</h3>
          <h3>Humidade / Temperatura</h3>

          {/* Toggle do Lixo dentro do Banheiro 1 */}
          <div className="toggle-subsection">
            <h3>Lixo</h3>
            <button onClick={toggleLixoBanheiro1} className="toggle-button">
              {isOpenLixoBanheiro1 ? 'Fechar' : 'Ver'}
            </button>
            <div className={`toggle-content ${isOpenLixoBanheiro1 ? 'open' : ''}`}>
              <p>Informações detalhadas sobre a gestão de lixo no banheiro 1.</p>
            </div>
          </div>

          <div className="toggle-subsection">
            <h3>Papel</h3>
            <button onClick={togglePapelBanheiro1} className="toggle-button">
              {isOpenPapelBanheiro1 ? 'Fechar' : 'Ver'}
            </button>
            <div className={`toggle-content ${isOpenPapelBanheiro1 ? 'open' : ''}`}>
              <p>Detalhes sobre o fornecimento e reposição de papel no banheiro 1.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Banheiro 2 */}
      <div className="toggle-container">
        <div className="toggle-section">
          <h2>Banheiro 2</h2>
          <button onClick={toggleBanheiro2} className="toggle-button">
            {isOpenBanheiro2 ? 'Fechar' : 'Ver'}
          </button>
        </div>

        <div className={`toggle-content ${isOpenBanheiro2 ? 'open' : ''}`}>
          <h3>Sabão</h3>
          <h3>Humidade / Temperatura</h3>

          {/* Toggle do Lixo dentro do Banheiro 2 */}
          <div className="toggle-subsection">
            <h3>Lixo</h3>
            <button onClick={toggleLixoBanheiro2} className="toggle-button">
              {isOpenLixoBanheiro2 ? 'Fechar' : 'Ver'}
            </button>
            <div className={`toggle-content ${isOpenLixoBanheiro2 ? 'open' : ''}`}>
              <h3>Informações sobre Lixo</h3>
            </div>
          </div>

          {/* Toggle do Papel dentro do Banheiro 2 */}
          <div className="toggle-subsection">
            <h3>Papel</h3>
            <button onClick={togglePapelBanheiro2} className="toggle-button">
              {isOpenPapelBanheiro2 ? 'Fechar' : 'Ver'}
            </button>
            <div className={`content ${isOpenPapelBanheiro2 ? 'open' : ''}`}>
              <h3> Papel</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToggleDiv;
