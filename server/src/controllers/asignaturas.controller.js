import { pool } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

export const add_subject = async (req, res) => { //Añade la asignatura
  const { codigo, nombre, descripcion, lab, controles, proyecto, cfg } = req.body || {}; //<---- VER LO DE VALIDATION

  const Asignatura_existe = await pool.query(
    'SELECT * FROM asignaturas WHERE codigo = $1',
    [codigo]
  );

  if (Asignatura_existe.rows.length > 0) { // Verificacion si existe la asignatura
    return res.status(400).json({
      message: 'La asignatura ya fue creada anteriormente',
    });
  }

  const id = uuidv4();
  const Nuevo_Ramo = await pool.query( // Crear asignatura
    'INSERT INTO asignaturas (id, codigo, nombre, descripcion, lab, controles, proyecto, cfg) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [id, codigo, nombre, descripcion, lab, controles, proyecto, cfg]
  );

  if (Nuevo_Ramo.rowCount === 0) { // manejo de errores
    return res.status(400).json({
      message: 'Error al crear el ramo',
    });
  }

  res.status(201).json({ // Creacion correcta
    message: 'Ramo creado correctamente',
    Nuevo_Ramo: { codigo, nombre, descripcion, lab, controles, proyecto, cfg },
  });
};

export const modify_subject = async (req, res) => {
  const { id } = req.params;
  const { codigo, nombre, descripcion, lab, controles, proyecto, cfg } = req.body || {};

  const datos_a_cambiar = { codigo, nombre, descripcion, lab, controles, proyecto, cfg };
  const campo_con_datos = [];
  const Valores = [];
  let posicion = 1;

  for (const llave in datos_a_cambiar) { // Verifica si hay datos en la consulta para armar una query dinamica
    if (datos_a_cambiar[llave] !== undefined) {
      campo_con_datos.push(`${llave} = $${posicion}`);
      Valores.push(datos_a_cambiar[llave]);
      posicion++;
    }
  }

  Valores.push(id); // Arma arreglo con valores para verificarlos despues

  const query = `UPDATE asignaturas SET ${campo_con_datos.join(', ')} WHERE id = $${posicion} RETURNING *`; // Update

  try {
    const resultado = await pool.query(query, Valores); // Manejo de errores

    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: 'Asignatura no encontrada.' });
    }

    res.json(resultado.rows[0]); // respuesta correcta
  } catch (error) { // falla interna
    console.error('Error al actualizar asignatura:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

export const search_subject = async (req, res) => {
  const {Pedido} = req.query || {};

   try {  
      const resultado = await pool.query(
      `SELECT codigo, nombre FROM asignaturas WHERE codigo ILIKE $1 OR nombre ILIKE $1 `, [`%${Pedido}%`]);
      res.json(resultado.rows)
  } catch (error) { // falla interna
    console.error('Error al buscar asignatura:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }

};
