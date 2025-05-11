import { pool } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator'
const esBool = valor => typeof valor === "boolean"
export const add_subject = async (req, res) => {

const {codigo, nombre, descripcion, lab, controles, proyecto, cfg } = req.body || {};
  // Manejo de errores al faltar una caracteristica o dato
  const errores = [];
  if (!codigo) errores.push('codigo');
  if (!nombre) errores.push('nombre');
  if (!descripcion) errores.push('descripcion');
  if (!lab) errores.push('lab');
  if (!controles) errores.push('controles');
  if (!proyecto) errores.push('proyecto');
  if (!cfg) errores.push('cfg');

  if (errores.length > 0) {

    return res.status(400).json({ message: 'Faltan campos obligatorios', campos: errores });

  }
  const codigo_valido = /^(CFG|CIT|ICB)/.test(codigo) 

  if(!codigo_valido) { //Verifica si el codigo de la asignatura lleva el identificador correcto

    return res.status(400).json({ message: 'El codigo no lleva un identificador valido (CFG|CIT|ICB)'});

  }

const Asignatura_existe = await pool.query('SELECT * FROM asignaturas WHERE codigo = $1', [codigo]);

  if (Asignatura_existe.rows.length > 0) {

    return res.status(400).json({ message: 'La asignatura ya fue creada anteriormente' });

  }
  if (![lab,controles,proyecto,cfg].every(esBool)){

    return res.status(400).json({ message: 'los valores lab, controles, proyecto, cfg deben ser booleanos'});

  }

const id = uuidv4();
const Nuevo_Ramo = await pool.query('INSERT INTO asignaturas (id, codigo, nombre, lab, controles, proyecto, cfg) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id, codigo, nombre, descripcion, lab, controles, proyecto, cfg ]);
  if (Nuevo_Ramo.rowCount === 0) {

    return res.status(400).json({ message: 'Error al crear el Ramo' });

  }
res.status(201).json({ message: 'Ramo creado correctamente', Nuevo_Ramo : {codigo, nombre, descripcion, lab, controles, proyecto, cfg }});





}

