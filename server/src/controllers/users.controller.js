import { pool } from '../db.js';
import bcrypt, { compare } from 'bcrypt';
import { validateRegister } from '../middleware/validaciones/auth.validation.js';

export const me = async (req, res) => {
  try {
    // Get user ID from middleware
    const userId = req.userId;
    
    // Query the database for complete user information
    const userResult = await pool.query(
      'SELECT id, nombre, apellido, username, email, anio_ingreso, reputacion, activo, verificado, created_at FROM usuarios WHERE id = $1', 
      [userId]
    );
    
    // Check if user exists
    if (userResult.rows.length === 0) {
      return res.status(404).json({ 
        ok: false, 
        message: 'Usuario no encontrado' 
      });
    }
    
    // Get user data without sensitive fields
    const userData = userResult.rows[0];
    
    // Return user data
    return res.status(200).json({
      ok: true,
      user: userData
    });
    
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return res.status(500).json({ 
      ok: false, 
      message: 'Error interno del servidor' 
    });
  }
}
export const changedata = async (req, res) => {
  try{
  const userId = req.userId; //Obtiene el id del usuario para trabajar con el
  const {nombre, apellido,anio_ingreso} = req.body || {};
  const datos_a_cambiar = {nombre, apellido,anio_ingreso};

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

  Valores.push(userId); 
  const query = `UPDATE usuarios SET ${campo_con_datos.join(', ')} WHERE id = $${posicion}`;

  const result = await pool.query(query, Valores);

  if (result.rowCount === 0) return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
  console.log("termino");
  return res.status(200).json({ ok: true, message: 'Datos cambiados correctamente' });
  

  } catch (error) {
    console.error("Error al actualizar datos del usuario:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export const changepassword = async (req, res) => {
  try{
  const id = req.userId; //Obtiene el id del usuario para trabajar con el
  const {contrasena,nueva_contrasena} = req.body || {};    

  const verificacion = await pool.query('SELECT contrasena FROM usuarios WHERE id = $1', [id]);


  if (verificacion.rowCount === 0) return res.status(404).json({ ok: false, message: 'Usuario no existe' });

  const match = await bcrypt.compare(contrasena, verificacion.rows[0].contrasena);

    if (!match) {
      return res.status(401).json({ ok: false, message: 'Contraseña actual incorrecta' });
    }
    const nueva_contrasena_Hasheada = await bcrypt.hash(nueva_contrasena, 10);
  
  const result = await pool.query('UPDATE usuarios SET contrasena = $1 WHERE id = $2', [nueva_contrasena_Hasheada, id]);

    // Verificar si se actualizó alguna fila
  if (result.rowCount === 0) return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });

  return res.status(200).json({ ok: true, message: 'Contraseña restablecida correctamente' });

  } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });

  }


}
