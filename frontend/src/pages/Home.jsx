import NavBar from "../components/NavBar"
import { Link } from "react-router-dom"


export default function Home() {
    return (
        <>
            <NavBar />
            <div className="home">
                <h1 className="title-home">Tenha mais gestão e qualidade com o LhaBath!</h1>
                <img src="./src/assets/banheiros.png" alt="Imagem de banheiros" />
                <button><Link to={'/login'}>Entrar</Link></button>
                <button><Link to={'/cadastro'}>Criar conta</Link></button>            
            </div>
        </>
    );
}