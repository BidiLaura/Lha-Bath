const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const banco = require('./banco'); // Conexão com o banco de dados
const app = express();

app.use(express.json());
const port = 3000;

// Configuração do CORS
app.use(cors({
    origin: '*'
}));

// Cadastrar usuário com painel associado
app.post('/cadastro', async (req, res) => {
    const { Nome, CNPJ, Telefone, Email, Senha } = req.body;

    try {
        // Criptografar a senha antes de salvar no banco
        const hashedPassword = await bcrypt.hash(Senha, 10);

        // Criar o painel vazio
        const painelQuery = `INSERT INTO Painel (Notificacao, Avisos, Secao_localidade, Calendario) VALUES (?, ?, ?, ?)`;
        const painelValues = ["", "", "", new Date()];
        
        banco.query(painelQuery, painelValues, (painelErr, painelResult) => {
            if (painelErr) {
                console.error('Erro ao criar painel:', painelErr);
                return res.status(500).json({ error: 'Erro ao criar painel.' });
            }

            const painelId = painelResult.insertId;

            // Criar o usuário com o ID_Painel associado e senha criptografada
            const userQuery = `
                INSERT INTO User (Nome, CNPJ, Telefone, Email, Senha, ID_Painel)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const userValues = [Nome, CNPJ, Telefone, Email, hashedPassword, painelId];

            banco.query(userQuery, userValues, (userErr, userResult) => {
                if (userErr) {
                    console.error('Erro ao cadastrar usuário:', userErr);
                    return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
                }

                const userId = userResult.insertId;

                // Gerar token
                const secret = "auaumiau";
                const token = jwt.sign({ id: userId }, secret, { expiresIn: '2 days' });

                res.status(201).json({ token });
            });
        });
    } catch (err) {
        console.error('Erro inesperado no cadastro:', err);
        res.status(500).json({ error: 'Erro inesperado no cadastro.' });
    }
});


// Login de usuário
app.post('/login', (req, res) => {
    const { Email, Senha } = req.body;

    banco.query(
        `SELECT * FROM User WHERE Email = ?`,
        [Email],
        async (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            const user = results[0];

            // Verificar a senha - usando bcrypt para comparar com a senha hashada do banco
            const passwordMatch = await bcrypt.compare(Senha, user.Senha);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Credenciais inválidas.' });
            }

            // Obter o painel associado ao usuário
            const painelQuery = `SELECT * FROM Painel WHERE ID_Painel = ?`;
            banco.query(painelQuery, [user.ID_Painel], (painelErr, painelResult) => {
                if (painelErr) {
                    console.error('Erro ao obter painel:', painelErr);
                    return res.status(500).json({ error: 'Erro ao obter painel associado.' });
                }

                const secret = "auaumiau";
                const token = jwt.sign({ id: user.ID_User }, secret, { expiresIn: '2 days' });

                return res.json({
                    token,
                    user: {
                        ID_User: user.ID_User,
                        Nome: user.Nome,
                        Email: user.Email,
                        ID_Painel: user.ID_Painel,
                        Painel: painelResult[0] || null,
                    },
                });
            });
        }
    );
});


// Atualizar usuário por ID
app.put('/atualizar/:id', (req, res) => {
    const { id } = req.params;
    const { CNPJ, Login, Email, Senha, Nome } = req.body;

    banco.query(
        `UPDATE User SET CNPJ = ?, Login = ?, Email = ?, Senha = ?, Nome = ? WHERE ID_User = ?`,
        [CNPJ, Login, Email, Senha, Nome, id],
        (err) => {
            if (err) {
                console.error('Erro na atualização:', err);
                return res.status(500).send('Erro ao atualizar usuário.');
            }
            res.send(`Usuário atualizado com sucesso:\n\nID: ${id}`);
        }
    );
});

// Deletar usuário por ID
app.delete('/deletar/:id', (req, res) => {
    const { id } = req.params;

    banco.query(
        `DELETE FROM User WHERE ID_User = ?`,
        [id],
        (err) => {
            if (err) {
                console.error('Erro ao deletar usuário:', err);
                return res.status(500).send('Erro ao deletar usuário.');
            }
            res.send('Usuário deletado com sucesso!');
        }
    );
});

// Listar todos os usuários
app.get('/', (req, res) => {
    banco.query(
        `SELECT * FROM User`,
        (err, results) => {
            if (err) {
                console.error('Erro ao consultar usuários:', err);
                return res.status(500).json({ error: 'Erro ao consultar usuários.' });
            }
            return res.json(results);
        }
    );
});

// Criar banheiro vazio
app.post('/banheiros', (req, res) => {
    const { Nome, ID_Painel, Localizacao } = req.body;

    banco.query(
        `INSERT INTO Banheiro (Nome, ID_Painel, Localizacao, Cabines) VALUES (?, ?, ?, ?)`,
        [Nome, ID_Painel, Localizacao, 0],  // Começa com 0 cabines
        (err, results) => {
            if (err) {
                console.error('Erro ao criar banheiro:', err);
                return res.status(500).json({ error: 'Erro ao criar banheiro' });
            }
            res.status(201).json({ message: 'Banheiro criado com sucesso!' });
        }
    );
});

// Listar banheiros
app.get('/banheiros', (req, res) => {
    banco.query(
        `SELECT * FROM Banheiro`,
        (err, results) => {
            if (err) {
                console.error('Erro ao listar banheiros:', err);
                return res.status(500).json({ error: 'Erro ao listar banheiros' });
            }
            res.json(results);
        }
    );
});

// Sensores de um banheiro
app.get('/sensores/:banheiroId', (req, res) => {
    const { banheiroId } = req.params;

    banco.query(
        `SELECT * FROM Sensor WHERE ID_Banheiro = ?`,
        [banheiroId],
        (err, results) => {
            if (err) {
                console.error('Erro ao buscar sensores:', err);
                return res.status(500).json({ error: 'Erro ao buscar sensores' });
            }
            return res.json(results);
        }
    );
});

// Histórico de um sensor
app.get('/historico/:sensorId', (req, res) => {
    const { sensorId } = req.params;

    banco.query(
        `SELECT * FROM Sensor_Historico WHERE ID_Sensor = ? ORDER BY Data_Timestamp DESC`,
        [sensorId],
        (err, results) => {
            if (err) {
                console.error('Erro ao buscar histórico do sensor:', err);
                return res.status(500).json({ error: 'Erro ao buscar histórico do sensor' });
            }
            return res.json(results);
        }
    );
});

// Estoque
app.put('/estoque/:painelId', (req, res) => {
    const { painelId } = req.params;
    const { Estoque_Papel, Estoque_Sabao } = req.body;

    banco.query(
        `UPDATE Estoque SET Estoque_Papel = ?, Estoque_Sabao = ? WHERE ID_Painel = ?`,
        [Estoque_Papel, Estoque_Sabao, painelId],
        (err) => {
            if (err) {
                console.error('Erro ao atualizar estoque:', err);
                return res.status(500).json({ error: 'Erro ao atualizar estoque' });
            }
            return res.json({ message: 'Estoque atualizado com sucesso!' });
        }
    );
});

// Inicializando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Porta ${port} já está em uso. Escolha outra porta.`);
    } else {
        console.error('Erro ao iniciar o servidor:', err);
    }
});
