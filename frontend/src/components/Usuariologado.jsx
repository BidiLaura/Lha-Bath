import React, { useEffect, useState } from "react";

const UsuarioLogado = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <div>Usuário não logado</div>;
  }

  return (
    <div>
      <h3>Bem-vindo, {user.Nome}</h3>
      <p>Email: {user.Email}</p>
    </div>
  );
};

export default UsuarioLogado;
