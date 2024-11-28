import React, { useState } from 'react';
import '../index.css';

const Cabine = ({ number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="cabine">
      <div
        className="cabine-header"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h3>Cabine {number}</h3>
        <span className={`arrow ${isOpen ? 'open' : ''}`}>&#x25BC;</span>
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

export default Cabine;
