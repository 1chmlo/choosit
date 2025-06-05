import { pool } from '../db.js';

export const get_all_subjects = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM asignaturas');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener asignaturas:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

export const add_subject = async (req, res) => {
  const { codigo, nombre, semestre, descripcion, lab, controles, proyecto, cfg } = req.body || {};

  const Asignatura_existe = await pool.query(
    'SELECT * FROM asignaturas WHERE codigo = $1',
    [codigo]
  );

  if (Asignatura_existe.rows.length > 0) {
    return res.status(400).json({
      message: 'La asignatura ya fue creada anteriormente',
    });
  }

  const Nuevo_Ramo = await pool.query(
    'INSERT INTO asignaturas (codigo, nombre, semestre, descripcion, lab, controles, proyecto, cfg) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [codigo, nombre, semestre, descripcion, lab, controles, proyecto, cfg]
  );

  const { id } = Nuevo_Ramo.rows[0];

  if (Nuevo_Ramo.rowCount === 0) {
    return res.status(400).json({
      message: 'Error al crear el ramo',
    });
  }

  res.status(201).json({
    message: 'Ramo creado correctamente',
    ramo: { id, codigo, nombre, semestre, descripcion, lab, controles, proyecto, cfg },
  });
};

export const modify_subject = async (req, res) => {
  const { id } = req.params;
  const { codigo, nombre, semestre, descripcion, lab, controles, proyecto, cfg } = req.body || {};

  const datos_a_cambiar = { codigo, nombre, semestre, descripcion, lab, controles, proyecto, cfg };
  const campo_con_datos = [];
  const Valores = [];
  let posicion = 1;

  for (const llave in datos_a_cambiar) {
    if (datos_a_cambiar[llave] !== undefined) {
      campo_con_datos.push(`${llave} = $${posicion}`);
      Valores.push(datos_a_cambiar[llave]);
      posicion++;
    }
  }

  Valores.push(id);

  const query = `UPDATE asignaturas SET ${campo_con_datos.join(', ')} WHERE id = $${posicion} RETURNING *`;

  try {
    const resultado = await pool.query(query, Valores);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: 'Asignatura no encontrada.' });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al actualizar asignatura:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

export const search_subject = async (req, res) => {
  const { busqueda } = req.query || {};

  try {
    const resultado = await pool.query(
      `SELECT codigo, nombre 
       FROM asignaturas
       WHERE unaccent(codigo) ILIKE unaccent($1)
       OR unaccent(nombre) ILIKE unaccent($1)`,
      [`%${busqueda}%`]
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al buscar asignatura:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

export const subject_all = async (req, res) => {
  const { codigo } = req.params;
  try {
    const asignaturaQuery = await pool.query(
      `SELECT id, codigo, descripcion, nombre, n_encuestas, lab, controles, proyecto, cfg
       FROM asignaturas WHERE codigo = $1`,
      [codigo]
    );

    if (asignaturaQuery.rows.length === 0)
      return res.status(404).json({ ok: false, message: "Asignatura no encontrada bajo tal código" });

    const asignatura = asignaturaQuery.rows[0];
    const id_asignatura = asignatura.id;

    const comentariosQuery = await pool.query( //* faltaba u.activo, no se mandaba *//
      `SELECT u.nombre, u.apellido, u.activo, c.id, c.fecha, c.reputacion, c.texto 
       FROM comentarios AS c
       JOIN usuarios AS u ON c.id_usuario = u.id
       WHERE c.id_asignatura = $1`,
      [id_asignatura]
    );
    asignatura.comentarios = comentariosQuery.rows;

    const preguntasQuery = await pool.query(`
      SELECT p.id, p.pregunta
      FROM encuestas e
      JOIN preguntas p ON e.id_tipo_pregunta = p.id_tipo_pregunta
      WHERE e.id_asignatura = $1
    `, [id_asignatura]);

    const respuestasPonderadasQuery = await pool.query(`
      select *
      from respuestas_ponderadas
      where id_asignatura = $1
    `, [id_asignatura]);
    if (respuestasPonderadasQuery.rowCount === 0) {
      respuestasPonderadasQuery.rows = [];
    }

    asignatura.respuestasPonderadas = respuestasPonderadasQuery.rows;

    return res.status(200).json({
      ok: true,
      asignatura,
      preguntas: preguntasQuery.rows
    });
  } catch (error) {
    console.error('Error al buscar asignatura:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
