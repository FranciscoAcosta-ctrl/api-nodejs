// src/controllers/userController.js
import UserModel from "../models/userModel.js";
import mongoose from 'mongoose';

const getUserById = async (req, res) => {
    try {
      // Obtén el ID del usuario desde la consulta
      const userId = req.query.userId;
        console.log(userId);
      // Verifica si el ID es válido antes de realizar la búsqueda en la base de datos
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "ID de usuario no válido" });
      }
  
      // Busca el usuario por su ID
      const user = await UserModel.findById(userId);
  
      // Verifica si el usuario existe
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      console.log(user);
      // Devuelve toda la información del usuario
      res.json({ user });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error al obtener la información del usuario por ID" });
    }
  };
  

const getUserInfo = (req, res) => {
  try {
    // Devolver la información del usuario
    res.json({ user: req.user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener la información del usuario" });
  }
};

export default {
  getUserInfo,
  getUserById,
};
