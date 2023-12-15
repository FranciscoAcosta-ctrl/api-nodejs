// src/controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import moment from "moment";
import UserModel from "../models/userModel.js";
import VerificationCodeModel from "../models/verificationCodeModel.js";
import {
  generateVerificationCode,
  sendVerificationEmail,
} from "../utils/jwtUtils.js";

const saltRounds = 10;

const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, birthDate } =
      req.body;

    // Validar si todos los campos requeridos están presentes
    if (
      !username ||
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !birthDate
    ) {
      const missingFields = [];

      if (!username) missingFields.push("username");
      if (!email) missingFields.push("email");
      if (!password) missingFields.push("password");
      if (!firstName) missingFields.push("firstName");
      if (!lastName) missingFields.push("lastName");
      if (!birthDate) missingFields.push("birthDate");

      return res.status(400).json({
        error: `Los siguientes campos son obligatorios: ${missingFields.join(
          ", "
        )}`,
      });
    }

    // Validar el formato de la fecha de nacimiento (puedes ajustar el formato según tus necesidades)
    if (!moment(birthDate, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).json({
        error:
          "El formato de la fecha de nacimiento no es válido. Debe ser en el formato YYYY-MM-DD.",
      });
    }

    // Validar el formato del correo electrónico usando una expresión regular
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ error: "El formato del correo electrónico no es válido." });
    }

    // Verificar si ya existe un usuario con el mismo correo electrónico
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "El correo electrónico ya está en uso." });
    }

    // Hash de la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear un nuevo usuario en la base de datos
    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      birthDate,
    });

    // Generar un token JWT
    const token = jwt.sign(
      { user: { id: newUser._id, username: newUser.username } },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar al usuario en la base de datos
    const user = await UserModel.findOne({ username });

    // Verificar las credenciales utilizando bcrypt
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar un token JWT
    const token = jwt.sign(
      { user: { id: user._id, username: user.username } },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

// Endpoint para solicitar el envío del código de verificación por correo electrónico
const requestVerificationCode = async (req, res) => {
  console.log("POST: /request-verification-code");

  try {
    const { email } = req.body;

    // Verificar que se proporcionó un correo electrónico
    if (!email) {
      return res
        .status(400)
        .json({ error: "Se requiere una dirección de correo electrónico." });
    }

    // Generar un código de verificación
    const verificationCode = generateVerificationCode();

    // Guardar el código de verificación en la tabla de códigos de verificación
    const expirationDate = new Date(Date.now() + 1 * 60 * 1000 + 30 * 1000); // 1 minuto y 30 segundos de expiración
    const verificationCodeEntry = new VerificationCodeModel({
      userEmail: email,
      code: verificationCode,
      expiration: expirationDate,
    });
    await verificationCodeEntry.save();

    // Actualizar el usuario con la referencia al código de verificación
    await UserModel.findOneAndUpdate(
      { email },
      { verificationCode: verificationCodeEntry._id },
      { new: true }
    );

    // Enviar el código de verificación por correo electrónico
    sendVerificationEmail(email, verificationCode);

    res
      .status(200)
      .json({ message: "Código de verificación enviado exitosamente." });
  } catch (error) {
    console.error(
      "Error al solicitar el código de verificación:",
      error.message
    );
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

// Endpoint para verificar el código de verificación
const verifyVerificationCode = async (req, res) => {
  console.log("POST: /verify-verification-code");

  try {
    const { email, verificationCode } = req.body;

    // Verificar que se proporcionó un correo electrónico y un código de verificación
    if (!email || !verificationCode) {
      return res.status(400).json({
        error:
          "Se requieren una dirección de correo electrónico y un código de verificación.",
      });
    }

    // Verificar que el correo electrónico exista en algún usuario
    const correo = await UserModel.findOne({ email });
    if (!correo) {
      return res.status(404).json({
        error:
          "No se encontró ningún usuario con el correo electrónico proporcionado.",
      });
    }

    const user = await UserModel.findOne({
      email,
      verificationCode: { $ne: null }, // Verificar que haya un código de verificación asociado al usuario
    }).populate("verificationCode");

    // Verificar el código de verificación en la base de datos
    if (user.isVerified) {
      return res.status(200).json({
        message: "Usuario verificado.",
      });
    }
    if (
      user.verificationCode &&
      user.verificationCode.code === verificationCode &&
      user.verificationCode.expiration > new Date()
    ) {
      // Código de verificación válido
      // Establecer isVerified en true
      user.isVerified = true;

      await user.save();

      res.status(200).json({
        message: "Código de verificación válido. Usuario verificado.",
      });
    } else {
      // Código de verificación no válido o expirado
      res
        .status(400)
        .json({ error: "Código de verificación no válido o expirado." });
    }
  } catch (error) {
    console.error(
      "Error al verificar el código de verificación:",
      error.message
    );
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export default {
  register,
  login,
  requestVerificationCode,
  verifyVerificationCode,
};
