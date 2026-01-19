const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User, SecurityLog } = require('../models');

/**
 * Genera un token JWT
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, rol: user.rol },
    config.JWT.SECRET,
    { expiresIn: config.JWT.EXPIRE }
  );
};

/**
 * Registro de nuevo usuario
 */
const register = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      correo,
      nombreUsuario,
      contraseña,
      pais,
      ciudad,
      fechaNacimiento,
      genero
    } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { correo },
          { nombreUsuario }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'El correo o nombre de usuario ya están registrados'
      });
    }

    // Crear usuario
    const user = await User.create({
      nombre,
      apellido,
      correo,
      nombreUsuario,
      contraseña,
      pais,
      ciudad,
      fechaNacimiento,
      genero
    });

    // Registrar evento de seguridad
    await SecurityLog.logEvent(user.id, 'ACCOUNT_CREATED', {
      severity: 'low',
      description: 'Nueva cuenta creada',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    // Generar token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
};

/**
 * Inicio de sesión
 */
const login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    // Buscar usuario por correo o nombre de usuario
    const { Op } = require('sequelize');
    const user = await User.findOne({ 
      where: { 
        [Op.or]: [
          { correo },
          { nombreUsuario: correo }
        ]
      } 
    });

    if (!user) {
      // Registrar intento fallido
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isValidPassword = await user.verificarContraseña(contraseña);

    if (!isValidPassword) {
      // Registrar intento fallido
      await SecurityLog.logEvent(user.id, 'LOGIN_FAILURE', {
        severity: 'medium',
        description: 'Intento de inicio de sesión fallido',
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        success: false
      });

      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Registrar inicio de sesión exitoso
    await SecurityLog.logEvent(user.id, 'LOGIN_SUCCESS', {
      severity: 'low',
      description: 'Inicio de sesión exitoso',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    // Generar token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

/**
 * Obtener usuario autenticado (verificar token)
 */
const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
};

/**
 * Obtener perfil del usuario autenticado
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      include: ['perfiles']
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      error: error.message
    });
  }
};

/**
 * Actualizar perfil del usuario
 */
const updateProfile = async (req, res) => {
  try {
    const { nombre, apellido, pais, ciudad, fechaNacimiento, genero } = req.body;

    const user = await User.findByPk(req.userId);

    await user.update({
      nombre,
      apellido,
      pais,
      ciudad,
      fechaNacimiento,
      genero
    });

    // Registrar evento
    await SecurityLog.logEvent(user.id, 'PROFILE_UPDATED', {
      severity: 'low',
      description: 'Perfil actualizado',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar perfil',
      error: error.message
    });
  }
};

/**
 * Cambiar contraseña
 */
const changePassword = async (req, res) => {
  try {
    const { contraseñaActual, contraseñaNueva } = req.body;

    const user = await User.findByPk(req.userId);

    // Verificar contraseña actual
    const isValid = await user.verificarContraseña(contraseñaActual);

    if (!isValid) {
      await SecurityLog.logEvent(user.id, 'PASSWORD_CHANGE_FAILED', {
        severity: 'medium',
        description: 'Intento de cambio de contraseña con contraseña actual incorrecta',
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        success: false
      });

      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    // Actualizar contraseña
    await user.update({ contraseña: contraseñaNueva });

    // Registrar evento
    await SecurityLog.logEvent(user.id, 'PASSWORD_CHANGED', {
      severity: 'high',
      description: 'Contraseña cambiada exitosamente',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Contraseña cambiada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cambiar contraseña',
      error: error.message
    });
  }
};

/**
 * Cambiar contraseña (alternativo con nombres en inglés)
 */
const changePasswordAlt = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.userId);

    // Verificar contraseña actual
    const isValid = await user.verificarContraseña(currentPassword);

    if (!isValid) {
      await SecurityLog.logEvent(user.id, 'PASSWORD_CHANGE_FAILED', {
        severity: 'medium',
        description: 'Intento de cambio de contraseña con contraseña actual incorrecta',
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        success: false
      });

      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    // Actualizar contraseña
    await user.update({ contraseña: newPassword });

    // Registrar evento
    await SecurityLog.logEvent(user.id, 'PASSWORD_CHANGED', {
      severity: 'high',
      description: 'Contraseña cambiada exitosamente',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Contraseña cambiada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cambiar contraseña',
      error: error.message
    });
  }
};

/**
 * Activar suscripción premium
 */
const activarPremium = async (req, res) => {
  try {
    const { plan, metodoPago } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Calcular fecha de fin según el plan
    const ahora = new Date();
    let fechaFinPremium;
    if (plan === 'anual') {
      fechaFinPremium = new Date(ahora.setFullYear(ahora.getFullYear() + 1));
    } else {
      fechaFinPremium = new Date(ahora.setMonth(ahora.getMonth() + 1));
    }

    // Actualizar usuario a premium
    await user.update({
      premiumActivo: true,
      fechaInicioPremium: new Date(),
      fechaFinPremium,
      metodoPago: metodoPago ? JSON.stringify(metodoPago) : null
    });

    // Registrar evento
    await SecurityLog.logEvent(user.id, 'PREMIUM_ACTIVATED', {
      severity: 'low',
      description: `Suscripción premium ${plan} activada`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Suscripción premium activada exitosamente',
      data: {
        premiumActivo: true,
        plan,
        fechaInicio: user.fechaInicioPremium,
        fechaFin: fechaFinPremium
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al activar premium',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  me,
  getProfile,
  updateProfile,
  changePassword,
  changePasswordAlt,
  activarPremium
};
