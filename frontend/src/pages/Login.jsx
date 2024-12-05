import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar"; 
import bcrypt from "bcryptjs"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 
  const loginContainerRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const hashedPassword = await bcrypt.hash(senha, 10); 

      const response = await axios.post("http://localhost:3000/login", {
        Email: email,
        Senha: hashedPassword, // Envia a senha já criptografada
      });

      const { token, user } = response.data;

      // Armazenar o token e dados do usuário no localStorage
      localStorage.setItem("token", token); // Armazena o token JWT
      localStorage.setItem("user", JSON.stringify(user)); // Armazena os dados do usuário

      // Redireciona para a página de painel após o login
      navigate("/usuario/painel"); // Redireciona com useNavigate
    } catch (error) {
      setError("Usuário ou senha inválidos.");
    }
  };

  const handleClickOutside = (e) => {
    // Verifica se o clique foi fora da caixa de login
    if (loginContainerRef.current && !loginContainerRef.current.contains(e.target)) {
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
        <div className="login-container active" ref={loginContainerRef}>
          <h1 className="title">Login</h1>
          {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>} {/* Mensagem de erro */}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          <div>
            <p>Não tem conta? <a href="/cadastro">Cadastre-se aqui</a></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
