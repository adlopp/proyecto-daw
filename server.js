const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tienda'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado a MySQL');
});

// login
app.post('/login', (req, res) => {
  const { usuario, contrasena } = req.body;

  db.query(
    'SELECT * FROM usuarios WHERE nombre = ? AND contrasena = ?',
    [usuario, contrasena],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error del servidor' });
      if (result.length > 0) {
        res.json({ success: true });
      } else {
        res.status(401).json({ success: false, mensaje: 'Credenciales incorrectas' });
      }
    }
  );
});

// registro
app.post('/register', (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    return res.status(400).json({ mensaje: 'Usuario y contraseña requeridos' });
  }

  // Verificar si el usuario ya existe
  db.query('SELECT * FROM usuarios WHERE nombre = ?', [usuario], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al verificar el usuario' });

    if (results.length > 0) {
      return res.status(409).json({ mensaje: 'El nombre de usuario ya está en uso' });
    }

    // Crear correo en base al nombre de usuario
    const correo = `${usuario}@gmail.com`;

    db.query(
      'INSERT INTO usuarios (nombre, correo, contrasena, direccion, telefono, fecha_registro) VALUES (?, ?, ?, ?, ?, NOW())',
      [usuario, correo, contrasena, '', ''],
      (err, result) => {
        if (err) return res.status(500).json({ mensaje: 'Error al registrar usuario' });
        res.json({ mensaje: 'Usuario registrado correctamente' });
      }
    );
  });
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
