// src/routes/userRoutes.js
import express from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Ruta para obtener la información del usuario actual a través del token
router.get('/auth', authMiddleware, userController.getUserInfo);

// Ruta para obtener la información de un usuario por su ID
router.get('/', authMiddleware, userController.getUserById);

export default router;
