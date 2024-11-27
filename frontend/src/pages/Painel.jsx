import NavBarPainel from "../components/NavBarPainel"
import { Link } from "react-router-dom"
import Banheiro from "../components/Banheiro"

export default function Painel() {
    return (
        <>
            <NavBarPainel/>
            <Banheiro/>
        </>
    )
}