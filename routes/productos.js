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

router.post('/validar-cambios', (req, res) => {
  const { id_usuario, nombre, correo, telefono } = req.body;

  console.log("Validando usuario:", req.body); // <--- AÑADE ESTO

  const sql = `
    SELECT * FROM usuarios 
    WHERE (nombre = ? OR correo = ? OR telefono = ?) 
    AND id_usuario != ?
  `;

  db.query(sql, [nombre, correo, telefono, id_usuario], (err, results) => {
    if (err) {
      console.error("Error en validación:", err.sqlMessage);
      return res.status(500).json({ mensaje: 'Error al validar los datos' });
    }

    if (results.length > 0) {
      return res.status(409).json({ mensaje: 'Nombre, correo o teléfono ya en uso' });
    }

    res.json({ mensaje: 'Datos válidos' });
  });
});


// Actualizar datos del usuario desde el perfil
router.put('/actualizar-usuario/:id', (req, res) => {
  const { nombre, contrasena, correo, direccion, telefono } = req.body;
  const id_usuario = req.params.id;

  console.log("Datos recibidos para actualizar:");
  console.log("ID:", id_usuario);
  console.log("Nombre:", nombre);
  console.log("Contraseña:", contrasena);
  console.log("Correo:", correo);
  console.log("Dirección:", direccion);
  console.log("Teléfono:", telefono);

  const sql = `
    UPDATE usuarios SET 
      nombre = ?, 
      contrasena = ?, 
      correo = ?, 
      direccion = ?, 
      telefono = ?
    WHERE id_usuario = ?
  `;

  db.query(sql, [nombre, contrasena, correo, direccion, telefono, id_usuario], (err) => {
    if (err) {
      console.error("Error al actualizar:", err.sqlMessage);
      return res.status(500).json({ mensaje: 'Error al actualizar usuario' });
    }

    res.json({ mensaje: 'Usuario actualizado correctamente' });
  });
});

// Crear pedido y actualizar stock
router.post('/pedido', (req, res) => {
  const { id_usuario, id_producto, cantidad, total, direccion } = req.body;

  if (!id_usuario || !id_producto || !cantidad || !total || !direccion) {
    return res.status(400).json({ mensaje: 'Datos incompletos del pedido' });
  }

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

    const insertarPedido = `
      INSERT INTO pedido (id_usuario, id_producto, cantidad, total, direccion)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertarPedido, [id_usuario, id_producto, cantidad, total, direccion], (err2, result2) => {
      if (err2) {
        console.error("Error al insertar pedido:", err2.sqlMessage);
        return res.status(500).json({ mensaje: 'Error al crear el pedido' });
      }

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

// Obtener un producto por ID
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

router.get('/pedidos', (req, res) => {
  db.query('SELECT * FROM pedido ORDER BY fecha DESC', (err, results) => {
    if (err) {
      console.error("Error al obtener pedidos:", err.sqlMessage);
      return res.status(500).json({ mensaje: 'Error al obtener pedidos' });
    }
    res.json(results);
  });
});

module.exports = router;
