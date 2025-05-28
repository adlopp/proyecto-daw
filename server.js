// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', (req, res) => {
  const { usuario, contrasena } = req.body;

  db.query(
    'SELECT * FROM usuarios WHERE nombre = ? AND contrasena = ?',
    [usuario, contrasena],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error del servidor' });

      if (result.length > 0) {
        res.json({ success: true, usuario: result[0].nombre });
      } else {
        res.status(401).json({ success: false, mensaje: 'Credenciales incorrectas' });
      }
    }
  );
});

app.post('/register', (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    return res.status(400).json({ mensaje: 'Usuario y contraseña requeridos' });
  }

  db.query('SELECT * FROM usuarios WHERE nombre = ?', [usuario], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al verificar el usuario' });

    if (results.length > 0) {
      return res.status(409).json({ mensaje: 'El nombre de usuario ya está en uso' });
    }

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

const productosRoutes = require('./routes/productos');
app.use('/api/productos', productosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
