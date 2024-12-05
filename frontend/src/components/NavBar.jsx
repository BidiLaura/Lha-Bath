import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Form } from "react-bootstrap";

export default function NavBar(toggleDarkMode) {
  return (
    <Navbar className="navbar">
      <Navbar.Brand>LhaBath</Navbar.Brand>
      <Nav className="ml-auto">
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/cadastro">Cadastro</Link></li>
        <li><a href="https://landing-page-lha-bath-pzhw.vercel.app">Saiba mais!</a></li>
      </ul>
      </Nav>
      <Form.Check
        type="switch"
        id="custom-switch"
        className="custom-switch"
        onChange={toggleDarkMode}
      />
      
    </Navbar>
  );
}
<ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/cadastro">Cadastro</Link></li>
        <li><a href="https://landing-page-lha-bath-pzhw.vercel.app">Saiba mais!</a></li>
      </ul>