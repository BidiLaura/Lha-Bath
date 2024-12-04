const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const banco = require('./banco'); // Importando a conexão com o banco
const app = express();

app.use(express.json());
const port = 3000;

// Configuração do CORS
app.use(cors({
    origin: '*'
}));

// Secret JWT
const secret = "auaumiau";

// Cadastrar usuário com painel associado
app.post('/cadastro', async (req, res) => {
    const { Nome, CNPJ, Telefone, Email, Senha } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(Senha, 10);

        // Criar painel vazio
        const painelQuery = `INSERT INTO Painel (Notificacao, Avisos, Secao_localidade, Calendario) VALUES (?, ?, ?, ?)`;
        const painelValues = ["", "", "", new Date()];

        banco.query(painelQuery, painelValues, (painelErr, painelResult) => {
            if (painelErr) {
                console.error('Erro ao criar painel:', painelErr);
                return res.status(500).json({ error: 'Erro ao criar painel.' });
            }

            const painelId = painelResult.insertId;

            // Criar usuário com senha criptografada e ID_Painel associado
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

    banco.query(`SELECT * FROM User WHERE Email = ?`, [Email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(Senha, user.Senha);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const token = jwt.sign({ id: user.ID_User }, secret, { expiresIn: '2 days' });
        res.json({ token, user });
    });
});

app.get('/sensores', (req, res) => {
    // Filtra sensores com resultado preenchido e limita a 4 registros
    const query = `SELECT * FROM Sensor `;

    banco.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar sensores:', err);
            return res.status(500).json({ error: 'Erro ao buscar sensores.' });
        }

        // Transforma os resultados em um objeto (chave por índice)
        const sensoresObj = {};
        results.forEach((sensor, index) => {
            sensoresObj[`sensor_${index + 1}`] = sensor;
        });

        res.json(sensoresObj);
    });
});



// Listar todos os usuários
app.get('/usuarios', (req, res) => {
    banco.query(`SELECT * FROM User`, (err, results) => {
        if (err) {
            console.error('Erro ao consultar usuários:', err);
            return res.status(500).json({ error: 'Erro ao consultar usuários.' });
        }
        return res.json(results);
    });
});

// Listar todos os banheiros
app.get('/banheiros', (req, res) => {
    banco.query(`SELECT * FROM Banheiro`, (err, results) => {
        if (err) {
            console.error('Erro ao listar banheiros:', err);
            return res.status(500).json({ error: 'Erro ao listar banheiros.' });
        }
        res.json(results);
    });
});
// Histórico diário
app.get("/sensor-history/daily/:id", async (req, res) => {
    const { id } = req.params;
    const { type } = req.query; // Recebe o tipo do sensor como parâmetro

    const query = `
        SELECT 
            AVG(price) AS Resultado
        FROM (
            SELECT 
                ID_Sensor, 
                Tipo_Sensor,
                DATE(Data_Timestamp) AS Date, 
                SUM(Resultado_Atual) AS price
            FROM Sensor_Logs
            WHERE ID_Sensor = ? AND Tipo_Sensor = ?
            GROUP BY Date, HOUR(Data_Timestamp)
        ) AS hourly_sums
    `;

    banco.query(query, [id, type], (err, results) => {
        if (err) {
            console.error("Erro ao obter histórico diário:", err);
            return res.status(500).json({ error: "Erro ao obter histórico diário" });
        }

        res.json(results);
    });
});

// Histórico semanal
app.get("/sensor-history/weekly/:id", async (req, res) => {
    const { id } = req.params;
    const { type } = req.query; // Recebe o tipo do sensor como parâmetro

    const query = `
        SELECT 
            AVG(price) AS Resultado
        FROM (
            SELECT 
                ID_Sensor, 
                Tipo_Sensor,
                YEAR(Data_Timestamp) AS Year, 
                WEEK(Data_Timestamp) AS Week, 
                SUM(Resultado_Atual) AS price
            FROM Sensor_Logs
            WHERE ID_Sensor = ? AND Tipo_Sensor = ?
            GROUP BY Year, Week
        ) AS weekly_sums
    `;

    banco.query(query, [id, type], (err, results) => {
        if (err) {
            console.error("Erro ao obter histórico semanal:", err);
            return res.status(500).json({ error: "Erro ao obter histórico semanal" });
        }

        res.json(results);
    });
});

// Histórico mensal
app.get("/sensor-history/monthly/:id", async (req, res) => {
    const { id } = req.params;
    const { type } = req.query; // Recebe o tipo do sensor como parâmetro

    const query = `
        SELECT 
            AVG(price) AS Resultado
        FROM (
            SELECT 
                ID_Sensor, 
                Tipo_Sensor,
                YEAR(Data_Timestamp) AS Year, 
                MONTH(Data_Timestamp) AS Month, 
                SUM(Resultado_Atual) AS price
            FROM Sensor_Logs
            WHERE ID_Sensor = ? AND Tipo_Sensor = ?
            GROUP BY Year, Month
        ) AS monthly_sums
    `;

    banco.query(query, [id, type], (err, results) => {
        if (err) {
            console.error("Erro ao obter histórico mensal:", err);
            return res.status(500).json({ error: "Erro ao obter histórico mensal" });
        }

        res.json(results);
    });
});

// Histórico anual
app.get("/sensor-history/yearly/:id", async (req, res) => {
    const { id } = req.params;
    const { type } = req.query; // Recebe o tipo do sensor como parâmetro

    const query = `
        SELECT 
            AVG(price) AS Resultado
        FROM (
            SELECT 
                ID_Sensor, 
                Tipo_Sensor,
                YEAR(Data_Timestamp) AS Year, 
                SUM(Resultado_Atual) AS price
            FROM Sensor_Logs
            WHERE ID_Sensor = ? AND Tipo_Sensor = ?
            GROUP BY Year
        ) AS yearly_sums
    `;

    banco.query(query, [id, type], (err, results) => {
        if (err) {
            console.error("Erro ao obter histórico anual:", err);
            return res.status(500).json({ error: "Erro ao obter histórico anual" });
        }

        res.json(results);
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
