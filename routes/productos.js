const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
//const multer = require('multer');

const path = require('path');

// LLKa configuracion de multer

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img'); // carpeta donde se guardan las imágenes
  },
  filename: function (req, file, cb) {
    const nombreUnico = Date.now() + '-' + file.originalname;
    cb(null, nombreUnico);
  }

});
const upload = multer({ storage });

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

router.put('/productos/:id', (req, res) => {
  const { nombre, precio, stock, descripcion } = req.body;
  const id = req.params.id;

  const sql = `
    UPDATE productos SET nombre = ?, precio = ?, stock = ?, descripcion = ? 
    WHERE id_producto = ?
  `;
  db.query(sql, [nombre, precio, stock, descripcion, id], (err) => {
    if (err) {
      console.error("Error al actualizar producto:", err.sqlMessage);
      return res.status(500).json({ mensaje: 'Error al actualizar producto' });
    }

    res.json({ mensaje: 'Producto actualizado correctamente' });
  });
});

router.post('/validar-cambios', (req, res) => {
  const { id_usuario, nombre, correo, telefono } = req.body;
  let condiciones = [];
  let valores = [];

  if (nombre?.trim()) {
    condiciones.push('(nombre = ? AND id_usuario != ?)');
    valores.push(nombre.trim(), id_usuario);
  }
  if (correo?.trim()) {
    condiciones.push('(correo = ? AND id_usuario != ?)');
    valores.push(correo.trim(), id_usuario);
  }
  if (telefono?.trim()) {
    condiciones.push('(telefono = ? AND id_usuario != ?)');
    valores.push(telefono.trim(), id_usuario);
  }
  if (condiciones.length === 0) {
    return res.json({ mensaje: 'Datos válidos' }); // Nada que validar
  }

  const sql = `
    SELECT nombre, correo, telefono FROM usuarios 
    WHERE ${condiciones.join(' OR ')}
  `;
  db.query(sql, valores, (err, results) => {
    if (err) {
      console.error("Error en validación:", err.sqlMessage);
      return res.status(500).json({ mensaje: 'Error al validar los datos' });
    }

    if (results.length > 0) {
      let conflictos = [];

      results.forEach(row => {
        if (row.nombre === nombre) conflictos.push('nombre');
        if (row.correo === correo) conflictos.push('correo');
        if (row.telefono === telefono) conflictos.push('teléfono');
      });

      const camposDuplicados = [...new Set(conflictos)].join(', ');
     
      return res.status(409).json({ mensaje: `Los siguientes campos ya están en uso: ${camposDuplicados}` });
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

router.get('/pedidos', (req, res) => {
  console.log("Endpoint /pedidos accedido");
  db.query('SELECT * FROM pedido ORDER BY fecha DESC', (err, results) => {
    if (err) {
      console.error("Error al obtener pedidos:", err.sqlMessage);
      return res.status(500).json({ mensaje: 'Error al obtener pedidos' });
    }
    res.json(results);
  });
});

// Actualizar producto por ID (modo administrador)
router.put('/editar/:id', upload.single('imagen'), (req, res) => {
  const id = req.params.id;
  const { nombre, precio, stock, descripcion, categoria } = req.body;
  const imagen = req.file ? `img/${req.file.filename}` : null; // guardar la ruta si hay imagen

  if (!nombre || precio == null || stock == null) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }

  const campos = [nombre, precio, stock, descripcion, categoria];
  let sql = `
    UPDATE productos 
    SET nombre = ?, precio = ?, stock = ?, descripcion = ?, categoria = ?
  `;

  if (imagen) {
    sql += `, imagen = ?`;
    campos.push(imagen);
  }

  sql += ` WHERE id_producto = ?`;
  campos.push(id);

  db.query(sql, campos, (err) => {
    if (err) {
      console.error('Error al actualizar producto:', err.sqlMessage);
      return res.status(500).json({ mensaje: 'Error al actualizar producto' });
    }

    res.json({ mensaje: 'Producto actualizado correctamente' });
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

// Crear nuevo producto
router.post('/', (req, res) => {
  const { nombre, precio, stock, descripcion, imagen, categoria } = req.body;

  if (!nombre || precio == null || stock == null) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios para crear el producto' });
  }

  const sql = `
    INSERT INTO productos (nombre, precio, stock, descripcion, imagen, categoria)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const valores = [
    nombre,
    precio,
    stock,
    descripcion || 'Sin descripción',
    imagen || 'img/default.png',
    categoria || 'Otro'
  ];

  db.query(sql, valores, (err, result) => {
    if (err) {
      console.error('Error al crear producto:', err.sqlMessage);
      return res.status(500).json({ mensaje: 'Error al crear producto' });
    }

    res.status(201).json({ mensaje: 'Producto creado correctamente', id: result.insertId });
  });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM productos WHERE id_producto = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar producto:', err.sqlMessage);
      return res.status(500).json({ mensaje: 'Error al eliminar producto' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto eliminado correctamente' });
  });
});


module.exports = router;
