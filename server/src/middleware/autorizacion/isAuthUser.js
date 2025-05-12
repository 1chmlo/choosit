import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config.js";

export const isAuthUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(400).json({ message: "No se ha proporcionado un token, inicia sesion"});

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(400).json({message: "No estas autorizado"});

    // Estos datos se pasan al controlador para que no se tenga que volver a decodificar el token
    // y se pueda acceder a ellos directamente desde req.userId, req.userUsername, etc.
    req.userId = decoded.id;
    req.userUsername = decoded.username;
    req.userActivo = decoded.activo;
    req.userVerificado = decoded.verificado;
    next();
  });
};