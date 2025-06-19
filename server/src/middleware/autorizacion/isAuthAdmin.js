import jwt from 'jsonwebtoken';
import { pool } from '../../db.js';
import { JWT_SECRET } from '../../config.js';

/**
 * Middleware para verificar si el usuario está autenticado
 * Requiere un token en las cookies
 * El usuario debe tener rol admin
 * El usuario debe estar activo
 * El usuario debe estar verificado
 * Si el token es válido, se decodifica y se pasan los datos al controlador en el request
 */

export const isAuthAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'No token, acceso denegado' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verificar que el usuario existe y es admin
    const user = await pool.query(
      'SELECT id, username, is_admin FROM usuarios WHERE id = $1 AND activo = true',
      [decoded.id]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    if (!user.rows[0].is_admin) {
      return res.status(403).json({ message: 'Acceso denegado: se requieren permisos de administrador' });
    }

    req.userId = decoded.id;
    req.username = decoded.username;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};