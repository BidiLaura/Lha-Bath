import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="nav">
      <h1>LhaBath</h1>
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/cadastro">Cadastro</Link></li>
        <li><a href="https://landing-page-lha-bath-pzhw.vercel.app">Saiba mais!</a></li>
      </ul>
    </nav>
  );
}
