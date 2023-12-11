// /src/routes/userRoutes.js
import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { getUser } from '../models/user.js';

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  const { username } = req.body;
  // Obtener información del usuario
  const user = getUser(username);

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado.' });
  }

  res.json({ user });
});

export default router;
