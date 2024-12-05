import { Link } from "react-router-dom";
import "../index.css";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa"; // Ícone de perfil genérico

export default function NavBarPainel() {
  return (
    <Navbar className="navbar">
      <Nav className="nav">
        <h1 className="title">LhaBath</h1>
        {/* Ícone de perfil com dropdown */}
        <Dropdown align="end" className="profile-icon">
          <Dropdown.Toggle variant="link" id="dropdown-profile" className="p-0">
            <FaUserCircle size={30} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to="/home">Home</Dropdown.Item>
            <Dropdown.Item as={Link} to="/usuario">Usuário</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
}
