const express = require('express');
const cors = require('cors');
const banco = require('./banco');
const app = express();
app.use(express.json());
const port = 3000;

// npm i cors
app.use(cors({
    origin:'*'
}));

// cadastrar usuario
app.post('/cadastro', (req, res) => {
    const { ID_User } = req.params;
    const { CNPJ, Login, Email, Senha, Nome} = req.body;
    console.log("O frontend requisitou uma rota de api")
    banco.query(
        `INSERT INTO User (CNPJ, Login, Email, Senha, Nome) VALUES (?, ?, ?, ?, ?)`,
        [CNPJ, Login, Email, Senha, Nome],
        (err, results) => {
            if (err) {
                console.error('Erro na inserção', err);
                return res.status(500).send('Erro na inserção');
            }
            res.send(`Usuario recebido!\n\nID: ${ID_User} \n CNPJ: ${CNPJ} \n E-mail: ${Email} \n Senha: ${Senha} \n Nome: ${Nome}`);
        }
    );
});

// atualizar por ID
app.put('/atualizar/:id', (req, res) => {
    const { ID_User } = req.params;
    const { CNPJ, Login, Email, Senha, Nome} = req.body;
    banco.query(
        `UPDATE User SET CNPJ = ?, Login = ?, Email = ?, Senha = ?, Nome = ? WHERE id = ?`,
        [CNPJ, Login, Email, Senha, Nome],
        (err, results) => {
            if (err) {
                console.error('Erro na atualização', err);
                return res.status(500).send('Erro na atualização');
            }
            res.send(`Usuário atualizado:\n\n ID: ${ID_User} \n CNPJ: ${CNPJ} \n Login: ${Login} \n E-mail: ${Email} \n Senha: ${Senha} \n Nome: ${Nome}`);
        }
    );
});

// deletar por ID
app.delete('/deletarid/:id', (req, res) => {
    const { ID_User } = req.params;
    banco.query(
        `DELETE FROM veiculos WHERE id = ?`,
        [Number(id)],
        (err, results) => {
            if (err) {
                console.error('Ops, erro para deletar.', err);
                return res.status(500).send('Erro ao deletar');
            }
            res.send(`Carro deletado com sucesso!`);
        }
    );
});

// selecionar por ID
app.get('/login/:id', (req, res) => {
    const { id } = req.params;
    banco.query(
        `SELECT * FROM User WHERE id = ?`,
        [Number(id)],
        (err, results) => {
            if (err) {
                console.error('Erro na consulta por id:', err);
                return res.status(500).json({ error: 'Erro ao consultar usuário por id' });
            }
            if (results.length === 0) {
                return res.status(404).send('Usuário não encontrado.');
              }
              return res.json(results[0]); // Retorna o primeiro usuário encontrado
            }
    );
});

app.listen(port, () => {
    console.log(`Exemplo de app sendo "escutado" na porta ${port}`);
});
