import bcrypt from "bcrypt";
import { createUser, getUser } from "../models/user.js";
import { generateToken } from "../utils/jwtUtils.js";

export const registerUser = async (req, res) => {
  console.log("POST: /register");
  try {
    const { username, password } = req.body;
    if (!username) {
      return res.status(401).json({ error: "Hace falta el valor username." });
    }
    if (!password) {
      return res.status(401).json({ error: "Hace falta el valor password." });
    }
    // Buscar al usuario en la base de datos
    const user = getUser(username);
    // Verificar si el usuario existe
    if (user) {
      return res.status(400).json({ error: "El usuario ya existe." });
    }

    // Hash de la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(password, 10);
    // Almacenar el usuario en la base de datos
    createUser(username, hashedPassword);
    // Crear un token JWT
    const token = generateToken({ username });

    res.status(201).json({message: "Usuario registrado exitosamente." , token });
  } catch (error) {
    console.error(
      "\x1b[31m",
      "POST: /register",
      "\x1b[0m",
      "\x1b[91m",
      error.message,
      "\x1b[0m"
    );
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const loginUser = async (req, res) => {
  console.log("POST: /login");
  try {
    const { username, password } = req.body;

    if (!username) {
      return res.status(401).json({ error: "Hace falta el valor username." });
    }
    if (!password) {
      return res.status(401).json({ error: "Hace falta el valor password." });
    }

    // Buscar al usuario en la base de datos
    const user = getUser(username);

    // Verificar si el usuario existe
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    // Crear un token JWT
    const token = generateToken({ username });

    res.json({ token });
  } catch (error) {
    console.error(
      "\x1b[31m",
      "POST: /login",
      "\x1b[0m",
      "\x1b[91m",
      error.message,
      "\x1b[0m"
    );
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
