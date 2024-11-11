import NavBar from "../components/NavBar"
import { Link } from 'react-router-dom'

export default function Login() {
    return (
        <>
            <NavBar />
            <div class="card">
                <div>
                    <h1 className="title">Login</h1>
                    <h5>Nome de usuário:</h5>
                    <input type="text" />
                    <h5>Senha:</h5>
                    <input type="text" />
                    <button>Entrar</button>
                    <li><Link to={'/cadastro'}>Não tem cadastro? Faça ele aqui!</Link></li>
                    <br /><br />
                    
                </div>
            </div>
        </>
    )
}