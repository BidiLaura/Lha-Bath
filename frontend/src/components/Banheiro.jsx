import React, { useState } from "react";
import "../index.css";

const Cabine = ({ number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="cabine">
      <div
        className="cabine-header"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h3>Cabine {number}</h3>
        <span className={`arrow ${isOpen ? "open" : ""}`}>&#x25BC;</span>
      </div>
      {isOpen && (
        <div className="cabine-content">
          <div className="banheiro-child">Lixeira</div>
          <div className="banheiro-child">Papel</div>
        </div>
      )}
    </div>
  );
};

const Banheiro = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="banheiro-container">
      <div className="banheiro-header" onClick={() => setIsOpen((prev) => !prev)}>
        <h2>Banheiro 1</h2>
        <span className={`arrow ${isOpen ? "open" : ""}`}>&#x25BC;</span>
      </div>
      {isOpen && (
        <div className="banheiro-content">
          {/* Itens fora das cabines */}
          <div className="banheiro-child">Sabão</div>
          <div className="banheiro-child">Sabão</div>
          <div className="banheiro-child">Lixeira</div>
          <div className="banheiro-child">Temperatura e Humidade</div>

          {/* Cabines */}
          {[1, 2, 3].map((cabineNumber) => (
            <Cabine key={cabineNumber} number={cabineNumber} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Banheiro;
