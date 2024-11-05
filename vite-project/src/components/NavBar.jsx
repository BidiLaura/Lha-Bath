import { Link } from 'react-router-dom'
import "../index.css"

export default function NavBar() {
    return (
        <>
            <nav className='nav'>
                LhaBath
                <ul>
                    <li><Link to={'/cadastro'}>Cadastro</Link></li>
                    <li><Link to={'/login'}>Login</Link></li>
                </ul>
            </nav>
        </>
    )
}