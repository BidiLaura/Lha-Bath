import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import NavBar from "../components/NavBar"; 
import bcrypt from "bcryptjs"; // Importando bcryptjs para fazer o hash da senha no cliente

const Cadastro = () => {
  const [formData, setFormData] = useState({
    Nome: "",
    CNPJ: "",
    Telefone: "",
    Email: "",
    Senha: "",
    ConfirmarSenha: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const cadastroContainerRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { Nome, CNPJ, Telefone, Email, Senha, ConfirmarSenha } = formData;

    // Validar senhas
    if (Senha !== ConfirmarSenha) {
      setError("As senhas não coincidem. Tente novamente.");
      return;
    }

    try {
      // Fazendo o hash da senha no cliente antes de enviar para o servidor
      const hashedPassword = await bcrypt.hash(Senha, 10); // 10 é o número de rounds do bcrypt

      // Enviar dados para o backend
      const res = await axios.post("http://localhost:3000/cadastro", {
        Nome,
        CNPJ,
        Telefone,
        Email,
        Senha: hashedPassword, // Envia a senha já criptografada
      });

      // Salvar token e redirecionar
      sessionStorage.setItem("token", res.data.token);
      navigate("/usuario/painel");
    } catch (err) {
      console.error("Erro ao cadastrar usuário:", err.response?.data || err.message);
      setError("Erro ao realizar o cadastro. Tente novamente mais tarde.");
    }
  };

  const handleClickOutside = (e) => {
    // Verifica se o clique foi fora da caixa de cadastro
    if (cadastroContainerRef.current && !cadastroContainerRef.current.contains(e.target)) {
      navigate("/"); // Redireciona para a página inicial
    }
  };

  // Adiciona o evento de clique no document quando o componente for montado
  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <NavBar />
      <div className="login-overlay active">
        <div className="login-container active" ref={cadastroContainerRef}>
          <h1 className="title">Cadastro</h1>
          <h5>Nome:</h5>
          <input
            type="text"
            name="Nome"
            value={formData.Nome}
            onChange={handleChange}
          />
          <h5>CNPJ:</h5>
          <input
            type="text"
            name="CNPJ"
            value={formData.CNPJ}
            onChange={handleChange}
          />
          <h5>Telefone para contato:</h5>
          <input
            type="text"
            name="Telefone"
            value={formData.Telefone}
            onChange={handleChange}
          />
          <h5>E-mail:</h5>
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
          />
          <h5>Senha:</h5>
          <input
            type="password"
            name="Senha"
            value={formData.Senha}
            onChange={handleChange}
          />
          <h5>Confirmar Senha:</h5>
          <input
            type="password"
            name="ConfirmarSenha"
            value={formData.ConfirmarSenha}
            onChange={handleChange}
          />
          <button onClick={handleSubmit}>Cadastrar</button>
          {error && <p style={{ color: "red" }}>{error}</p>} {/* Mensagem de erro */}
          <li>
            <a href="/login">Já tem cadastro? Entre aqui!</a>
          </li>
        </div>
      </div>
    </>
  );
};

export default Cadastro;
