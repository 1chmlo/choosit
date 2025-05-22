import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config.js";

export const isAuthUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(400).json({ ok: false, message: "No se ha proporcionado un token, inicia sesion"});

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    //return res.json({decoded});
    if (err) return res.status(400).json({message: err.message});
    if(decoded.rol !== "usuario" && decoded.rol !== "admin") return res.status(403).json({ok: false, message: "No tienes permisos para acceder a este recurso"});
    if(decoded.activo === false) return res.status(400).json({ok: false, message: "Usuario no activo"});
    if(decoded.verificado === false) return res.status(400).json({ok:false, message: "Usuario no verificado"});

    // Estos datos se pasan al controlador para que no se tenga que volver a decodificar el token
    // y se pueda acceder a ellos directamente desde req.userId, req.userUsername, etc.
    req.userId = decoded.id;
    req.userUsername = decoded.username;
    req.userActivo = decoded.activo;
    req.userVerificado = decoded.verificado;
    next();
  });
};