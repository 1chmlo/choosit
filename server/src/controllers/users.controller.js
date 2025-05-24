import { pool } from '../db.js';

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