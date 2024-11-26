import React, { useState } from 'react';
import '../index.css'; // Aqui você vai importar seu arquivo de estilos

const ToggleDiv = () => {
  // Estado para controlar se a div está aberta ou fechada
  const [isOpen, setIsOpen] = useState(false);

  // Função para alternar o estado
  const toggleDiv = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="toggle-container">
      <button onClick={toggleDiv} className="toggle-button">
        {isOpen ? 'Fechar' : 'Abrir'}
      </button>
      
      <div className={`toggle-content ${isOpen ? 'open' : ''}`}>
        {/* Conteúdo da div que será mostrado ou escondido */}
        <p>Este é o conteúdo que pode ser mostrado ou escondido.</p>
      </div>
    </div>
  );
};

export default ToggleDiv;
