const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener usuario por nombre
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

// Crear pedido y actualizar stock
router.post('/pedido', (req, res) => {
  const { id_usuario, id_producto, cantidad, total, direccion } = req.body;

  if (!id_usuario || !id_producto || !cantidad || !total || !direccion) {
    return res.status(400).json({ mensaje: 'Datos incompletos del pedido' });
  }

  // Primero, comprobar que hay stock suficiente
  db.query('SELECT stock FROM productos WHERE id_producto = ?', [id_producto], (err, result) => {
    if (err) {
      console.error("Error al consultar stock:", err.sqlMessage);
      return res.status(500).json({ mensaje: 'Error al verificar stock' });
    }

    if (result.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    const stockActual = result[0].stock;
    if (stockActual < cantidad) {
      return res.status(400).json({ mensaje: 'No hay suficiente stock disponible' });
    }

    // Insertar el pedido
    const insertarPedido = `
      INSERT INTO pedido (id_usuario, id_producto, cantidad, total, direccion)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertarPedido, [id_usuario, id_producto, cantidad, total, direccion], (err2, result2) => {
      if (err2) {
        console.error("Error al insertar pedido:", err2.sqlMessage);
        return res.status(500).json({ mensaje: 'Error al crear el pedido' });
      }

      // Actualizar el stock (ya comprobado)
      const nuevoStock = stockActual - cantidad;
      db.query('UPDATE productos SET stock = ? WHERE id_producto = ?', [nuevoStock, id_producto], (err3) => {
        if (err3) {
          console.error("Error al actualizar stock:", err3.sqlMessage);
          return res.status(500).json({ mensaje: 'Pedido creado, pero error al actualizar stock' });
        }

        res.json({ mensaje: 'Pedido registrado correctamente', id_pedido: result2.insertId });
      });
    });
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

module.exports = router;
