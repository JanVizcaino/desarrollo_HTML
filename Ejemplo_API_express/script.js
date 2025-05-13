const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'testAPI'
})

app.use(express.json())

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error al consultar la base de datos mientras se intentaba acceder a los usuarios:', err);
            res.status(500).json({ error: 'Error al consultar la base de datos mientras se intentaba acceder a los usuarios' });
        } else {
            res.json({ users: results });
        }
    });
});

app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error al encontrar el usuario: ', err);
            res.status(500).json({ error: 'Error al encontrar el usuario' });
        } else {
            if (results.length === 0) {
                res.status(404).json({
                    error: 'No se encontró el usuario'
                });
            } else {
                res.json({ user: results[0] });
            }
        }
    });
});

app.post('/api/users', (req, res) => {
    const newUser = req.body;
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [newUser.name, newUser.email, newUser.password], (err, results) => {
        if (err) {
            console.error('Error al crear un nuevo usuario:', err);
            res.status(500).json({ error: 'Error al crear un nuevo usuario' });
        } else {
            res.json({ message: 'Usuario creado con éxito' });
        }
    });
});


app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});