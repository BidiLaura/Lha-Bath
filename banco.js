// Importando biblioteca
const mysql = require('mysql2')

const connection = mysql.createConnection({
    host:'bf2hgksbofkyol7tyssq-mysql.services.clever-cloud.com',
    user:'ulcqjl6osg5ute8i',
    password:'SXNU7N8PnPTYzeuavkfM',
    database:'bf2hgksbofkyol7tyssq'
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