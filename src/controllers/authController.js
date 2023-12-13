// src/controllers/authController.js
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verificar si el usuario ya existe en la simulación de la base de datos
    if (UserModel.findUserByUsername(username)) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Crear un nuevo usuario en la simulación de la base de datos
    const newUser = UserModel.createUser(username, password);

    // Generar un token JWT
    const token = jwt.sign({ user: { id: newUser.id, username: newUser.username } }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar al usuario en la simulación de la base de datos
    const user = UserModel.findUserByUsername(username);

    // Verificar las credenciales
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar un token JWT
    const token = jwt.sign({ user: { id: user.id, username: user.username } }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

export default {
  register,
  login,
};
