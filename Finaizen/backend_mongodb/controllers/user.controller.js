const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Perfil = require("../models/perfil.model");

const JWT_SECRET = process.env.JWT_SECRET || "FinaizenSecretKey2025MuySegura!";
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "30d";

/**
 * Genera un token JWT
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });
};

/**
 * POST /api/register
 * Registrar un nuevo usuario
 */
module.exports.createUser = async (req, res) => {
  try {
    const { nombre, apellido, correo, nombreUsuario, contraseña, pais, ciudad } = req.body;

    // Validar campos requeridos
    if (!nombre || !apellido || !correo || !nombreUsuario || !contraseña) {
      return res.status(400).json({
        mensaje: "Faltan campos obligatorios",
        requeridos: ["nombre", "apellido", "correo", "nombreUsuario", "contraseña"],
      });
    }

    // Verificar si el correo ya existe
    const correoExiste = await User.findOne({ correo });
    if (correoExiste) {
      return res.status(400).json({
        mensaje: "El correo electrónico ya está registrado",
      });
    }

    // Verificar si el nombre de usuario ya existe
    const usuarioExiste = await User.findOne({ nombreUsuario });
    if (usuarioExiste) {
      return res.status(400).json({
        mensaje: "El nombre de usuario ya está en uso",
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    // Crear usuario
    const nuevoUsuario = await User.create({
      nombre,
      apellido,
      correo,
      nombreUsuario,
      contraseña: hashedPassword,
      pais: pais || "Ecuador",
      ciudad: ciudad || "",
    });

    // Crear perfil por defecto para el usuario
    const monedaInfo = Perfil.getMonedaPorPais(nuevoUsuario.pais);
    await Perfil.create({
      userId: nuevoUsuario._id,
      nombre: "Principal",
      moneda: monedaInfo.codigo,
      simboloMoneda: monedaInfo.simbolo,
    });

    // Responder con el usuario (sin contraseña) y token
    res.status(201).json({
      mensaje: "Usuario registrado exitosamente",
      usuario: nuevoUsuario.toPublicJSON(),
      token: generateToken(nuevoUsuario._id),
    });
  } catch (error) {
    console.log("❌ Error en registro:", error);
    res.status(500).json({
      mensaje: "Error al registrar usuario",
      error: error.message,
    });
  }
};

/**
 * POST /api/login
 * Iniciar sesión
 */
module.exports.loginUser = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    // Validar campos
    if (!correo || !contraseña) {
      return res.status(400).json({
        mensaje: "Correo y contraseña son obligatorios",
      });
    }

    // Buscar usuario por correo
    const usuario = await User.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        mensaje: "Credenciales incorrectas",
      });
    }

    // Verificar contraseña
    const contraseñaValida = await usuario.compararContraseña(contraseña);
    if (!contraseñaValida) {
      return res.status(400).json({
        mensaje: "Credenciales incorrectas",
      });
    }

    // Responder con usuario y token
    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      usuario: usuario.toPublicJSON(),
      token: generateToken(usuario._id),
    });
  } catch (error) {
    console.log("❌ Error en login:", error);
    res.status(500).json({
      mensaje: "Error al iniciar sesión",
      error: error.message,
    });
  }
};

/**
 * GET /api/me
 * Obtener perfil del usuario autenticado
 */
module.exports.getMe = async (req, res) => {
  try {
    const usuario = await User.findById(req.user._id).select("-contraseña");
    
    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      usuario: usuario.toPublicJSON(),
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener perfil",
      error: error.message,
    });
  }
};

/**
 * PUT /api/me
 * Actualizar perfil del usuario autenticado
 */
module.exports.updateMe = async (req, res) => {
  try {
    const { nombre, apellido, pais, ciudad, fechaNacimiento, genero } = req.body;

    const usuarioActualizado = await User.findByIdAndUpdate(
      req.user._id,
      {
        nombre,
        apellido,
        pais,
        ciudad,
        fechaNacimiento,
        genero,
      },
      { new: true, runValidators: true }
    ).select("-contraseña");

    res.status(200).json({
      mensaje: "Perfil actualizado exitosamente",
      usuario: usuarioActualizado.toPublicJSON(),
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar perfil",
      error: error.message,
    });
  }
};
