// src/routes/authRoutes.js
import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// Nuevas rutas para la verificación de correo electrónico
router.post('/request-verification-code', authController.requestVerificationCode);
router.post('/verify-verification-code', authController.verifyVerificationCode);

export default router;
