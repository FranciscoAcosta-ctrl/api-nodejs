// /src/models/user.js
import bcrypt from 'bcrypt';

export const users = [];

export const createUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
};

export const getUser = (username) => {
  return users.find(user => user.username === username);
};

// Crear algunos usuarios provisionales
createUser('usuario1', 'clave1');
createUser('usuario2', 'clave2');
