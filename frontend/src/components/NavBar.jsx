import { Link } from 'react-router-dom';
import "../index.css";
import { Navbar, Nav, Form } from "react-bootstrap";


export default function NavBar() {
    return (
        <Navbar className="navbar">
            <Nav className="nav">
                <h1 className="title">LhaBath</h1>
                <ul>
                    <li><Link to={'/home'}>Home</Link></li>
                    <li><Link to={'/login'}>Login</Link></li>
                    <li><Link to={'/cadastro'}>Cadastro</Link></li>
                    <li><Link to={'/painel'}>Painel teste</Link></li>
                </ul>
            </Nav>
        </Navbar>
    );
}
