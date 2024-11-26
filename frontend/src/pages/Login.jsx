import { useEffect, useState } from "react"
import NavBar from "../components/NavBar"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login() {

    const [Login, setLogin] = useState("")
    const [Senha, setSenha] = useState("")

    const navigate = useNavigate();

    const userLogin = async () => {
        try {
            console.log(Login, Senha); 
            await axios.post('http://localhost:3000/login', {Login, Senha}
            );
        } 
        catch (err) {
            console.log(err);
        }
    }

    const handleLogin = () => {
        userLogin()
        navigate("/painel")
    }

    return (
        <>
            <NavBar />
            <div className="login">
            <div className="card">
                <div>
                    <h1 className="title">Login</h1>
                    <h5>Nome de usuário:</h5>
                    <input type="text" onChange={(e) => setLogin(e.target.value)}/>
                    <h5>Senha:</h5>
                    <input type="text"  onChange={(e) => setSenha(e.target.value)}/>
                    <button onClick={handleLogin}>Entrar</button>
                    <li><Link to={'/cadastro'}>Não tem cadastro? Faça ele aqui!</Link></li>
                </div>
            </div>
            </div>        
        </>
    )
}