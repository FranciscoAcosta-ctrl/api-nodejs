// src/controllers/userController.js
const getUserInfo = (req, res) => {
    try {
      // Devolver la información del usuario
      res.json({ user: req.user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener la información del usuario' });
    }
  };
  
  export default {
    getUserInfo,
  };
  