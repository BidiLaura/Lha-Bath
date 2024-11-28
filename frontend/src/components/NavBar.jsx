import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="nav">
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/cadastro">Cadastro</Link></li>
      </ul>
    </nav>
  );
}
