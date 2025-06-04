const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/usuario/:nombre', (req, res) => {
  const nombre = req.params.nombre;
  const sql = 'SELECT * FROM usuarios WHERE nombre = ?';

  db.query(sql, [nombre], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensaje: 'Error al obtener el usuario' });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(results[0]);
  });
});

// Obtener todos los productos
router.get('/', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensaje: 'Error al obtener productos' });
    }
    res.json(results);
  });
});

// Esta va al final
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM productos WHERE id_producto = ?';

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensaje: 'Error al obtener el producto' });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(results[0]);
  });
});

router.post('/pedido', (req, res) => {
  console.log("📥 Datos recibidos del pedido:", req.body); // NUEVO

  const { id_usuario, id_producto, cantidad, total, direccion } = req.body;

  if (!id_usuario || !id_producto || !cantidad || !total || !direccion) {
    return res.status(400).json({ mensaje: 'Datos incompletos del pedido' });
  }

  const sql = `
    INSERT INTO pedido (id_usuario, id_producto, cantidad, total, direccion)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [id_usuario, id_producto, cantidad, total, direccion], (err, result) => {
    if (err) {
      console.error("Error al insertar pedido:", err.sqlMessage); 
      return res.status(500).json({ mensaje: 'Error al crear el pedido' });
    }

    res.json({ mensaje: 'Pedido registrado correctamente', id_pedido: result.insertId });
  });
});


module.exports = router;
