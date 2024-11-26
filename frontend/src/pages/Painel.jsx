import NavBarPainel from "../components/NavBarPainel"
import { Link } from "react-router-dom"
import ToggleDiv from "../components/AbreFecha"

export default function Painel() {
    return (
        <>
            <NavBarPainel/>
            <ToggleDiv />
        </>
    )
}