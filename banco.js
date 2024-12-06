// Importando biblioteca
const mysql = require('mysql2')

const connection = mysql.createConnection({
    host:'bfyen7rrtwgptlb9eeex-mysql.services.clever-cloud.com',
    user:'ubpvvbvzt481f1th',
    password:'8HapoD3kjGYyZSwTSA52',
    database:'bfyen7rrtwgptlb9eeex'
})

//Cria conexão
connection.connect(err => {
    if(err) {
        console.error('Erro ao conectar ao banco de dados:', err)
        return
    }
    console.log('Conectado ao banco de dados')
})

module.exports = connection