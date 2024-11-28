import { Link } from 'react-router-dom';
import "../index.css";
import { Navbar, Nav } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa"; // Ícone de perfil genérico

export default function NavBarPainel() {
    return (
        <Navbar className="navbar">
            <Nav className="nav">
                <h1 className="title">LhaBath</h1>
                <ul>
                    <li><Link to={'/home'}>Home</Link></li>
                    <li><Link to={'/usuario'}>Usuário</Link></li>
                    <li><Link to={'/usuario/painel'}>Painel</Link></li>
                </ul>
                {/* Ícone de perfil no canto direito */}
                <div className="profile-icon">
                    <Link to="/usuario/painel">
                        <FaUserCircle size={30} />
                    </Link>
                </div>
            </Nav>
        </Navbar>
    );
}
