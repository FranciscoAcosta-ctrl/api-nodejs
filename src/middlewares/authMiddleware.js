// /src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import { secretKey } from "../utils/jwtUtils.js";

export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];;
  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado." });
  }
  
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.error("Error al verificar el token:", err.name, "-", err.message);
      return res.status(403).json({ error: "Token no válido." });
    }

    req.user = user;
    next();
  });
};
