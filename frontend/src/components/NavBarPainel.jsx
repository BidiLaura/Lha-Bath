import { Link } from 'react-router-dom';
import "../index.css"; // CSS para o estilo
import { Navbar, Nav } from "react-bootstrap";

export default function NavBarPainel() {
    return (
        <Navbar className="navbar">
        <Nav className="nav">
            <h1 className="title">LhaBath</h1>
            <ul>
                <li><Link to={'/home'}>Home</Link></li>
                <li><Link to={'/usuario'}>Usuário</Link></li>
                <li><Link to={'/painel'}>Painel</Link></li>
            </ul>
        </Nav>
    </Navbar>
    );
}
