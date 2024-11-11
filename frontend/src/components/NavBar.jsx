import { Link } from 'react-router-dom'
import "../index.css"

export default function NavBar() {
    return (
        <>
            <nav className='nav'>
            <h1 className="title">Lha - Bath</h1>
                <ul>
                    <li><Link to={'/home'}>Home</Link></li>
                    <li><Link to={'/login'}>Login</Link></li>
                    <li><Link to={'/cadastro'}>Cadastro</Link></li>
                    <li><Link to={'/painel'}>Painel teste</Link></li>
                </ul>
            </nav>
        </>
    )
}