import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config.js";

/**
 * Middleware para verificar si el usuario puede resetear su contraseña
 * Requiere un token en las cookies
 * El usuario debe estar activo
 * Si el token es válido, se decodifica y se pasan los datos al controlador en el request
 */

export const isAuthResetPassword = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(400).json({ ok: false, message: "No se ha proporcionado un token, inicia sesion"});

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    //return res.json({decoded});
    if (err) return res.status(400).json({message: err.message});
    if(decoded.tipo !== "reset-password") return res.status(403).json({ok: false, message: "No tienes permisos para acceder a este recurso"});
    if(decoded.activo === false) return res.status(400).json({ok: false, message: "Usuario no activo"});

    // Estos datos se pasan al controlador para que no se tenga que volver a decodificar el token
    // y se pueda acceder a ellos directamente desde req.userId, req.userUsername, etc.
    req.userId = decoded.id;
    req.userUsername = decoded.username;
    req.userActivo = decoded.activo;
    req.userVerificado = decoded.verificado;
    next();
  });
};