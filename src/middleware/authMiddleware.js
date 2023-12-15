// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Obtener el token del encabezado "Authorization" de la solicitud
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ msg: 'No hay token, autorización denegada' });
  }

  try {
    // Extraer el token de la cabecera "Authorization"
    const token = authHeader.split(' ')[1];

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Agregar el usuario decodificado al objeto de solicitud
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token no válido' });
  }
};

export default authMiddleware;
