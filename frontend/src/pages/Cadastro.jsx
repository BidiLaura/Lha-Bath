import NavBar from "../components/NavBar"
import { Link } from 'react-router-dom'

export default function Cadastro() {
    return (
        <>
            <NavBar />
            <div class="card">
                <div>
                    <h1 className="title">Cadastro</h1>
                    <h5>Nome:</h5>
                    <input type="text" />
                    <h5>CNPJ:</h5>
                    <input type="text" />
                    <h5>Telefone para contato:</h5>
                    <input type="text" />
                    <h5>E-mail:</h5>
                    <input type="text" />
                    <h5>Senha:</h5>
                    <input type="text" />
                    <h5>Confirmar Senha:</h5>
                    <input type="text" />
                    <button><Link to={'/login'}>Cadastrar</Link></button>
                    <li><Link to={'/login'}>Já tem cadastro? Entre aqui!</Link></li>                    
                </div>
            </div>
        </>
    )
}