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
    const { id } = req.params;
    const { CNPJ, Login, Email, Senha, Nome} = req.body;
    banco.query(
        `UPDATE User SET CNPJ = ?, Login = ?, Email = ?, Senha = ?, Nome = ? WHERE ID_User = ?`,
        [CNPJ, Login, Email, Senha, Nome, id],
        (err, results) => {
            if (err) {
                console.error('Erro na atualização', err);
                return res.status(500).send('Erro na atualização');
            }
            res.send(`Usuário atualizado:\n\n ID: ${id} \n CNPJ: ${CNPJ} \n Login: ${Login} \n E-mail: ${Email} \n Senha: ${Senha} \n Nome: ${Nome}`);
        }
    );
});

// deletar por id
app.delete('/deletar/:id', (req, res) => {
    const { ID_User } = req.params;
    banco.query(
        `DELETE * FROM User WHERE ID_User = ?`,
        [Number(ID_User)],
        (err, results) => {
            if (err) {
                console.error('Ops, erro para deletar.', err);
                return res.status(500).send('Erro ao deletar');
            }
            res.send(`Usuário deletado com sucesso!`);
        }
    );
});

// selecionar por ID
app.post('/Login', (req, res) => {
    const { Login, Senha } = req.body;
    console.log(Login, Senha)
    banco.query(
        `SELECT * FROM User WHERE Login = ? AND Senha = ?`,
        [Login, Senha],  // Passando os valores de Login e Senha corretamente
        (err, results) => {
            if (err) {
                console.error('Erro na consulta por Login:', err);
                return res.status(500).json({ error: 'Erro ao consultar usuário.' });
            }
            if (results.length === 0) {
                return res.status(404).send('Usuário não encontrado.');
            }
            return res.json(results[0]);
        }
    );    
});

app.get('/', (req, res) => {
    banco.query(
        `SELECT * FROM user`,
        function (err, results, fields) {
            if (err) {
                console.error('Erro na consulta:', err);
                return res.status(500).json({ error: 'Erro ao consultar veículos' });
            }
            // Retorna os resultados como um objeto JSON
            return res.json(results);
        }
    );
});

app.get('/Clima', (req, res) => {
    const { Local, Resultado_Humi } = req.body;
    banco.query(
        `SELECT * FROM Sensor_humi_temp`,
        function (err, results, fields) {
            if (err) {
                console.error('Erro na consulta:', err);
                return res.status(500).json({ error: 'Erro ao consultar veículos' });
            }
            // Retorna os resultados como um objeto JSON
            return res.json(results);
        }
    );
});

app.listen(port, () => {
    console.log(`Ta funfando na porta ${port} ;)`);
});