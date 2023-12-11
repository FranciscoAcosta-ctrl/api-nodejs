// /src/routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
