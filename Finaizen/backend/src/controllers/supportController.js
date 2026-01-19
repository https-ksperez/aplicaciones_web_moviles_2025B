const { SupportTicket, SupportAgent, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Obtener todos los tickets
 */
const getAll = async (req, res) => {
  try {
    const { estado, prioridad } = req.query;

    const where = {};
    if (estado) where.estado = estado;
    if (prioridad) where.prioridad = prioridad;

    const tickets = await SupportTicket.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: tickets.map((t, index) => ({
        id: t.numeroTicket || (485 + index),
        odooId: t.id,
        user: t.emailUsuario,
        subject: t.asunto,
        description: t.descripcion,
        date: t.createdAt.toISOString().split('T')[0],
        status: t.estado,
        priority: t.prioridad,
        assignedTo: t.asignadoA,
        response: t.respuesta
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener tickets',
      error: error.message
    });
  }
};

/**
 * Obtener KPIs de soporte
 */
const getKPIs = async (req, res) => {
  try {
    const newTickets = await SupportTicket.count({ where: { estado: 'nuevo' } });
    const resolvedTickets = await SupportTicket.count({ where: { estado: 'resuelto' } });

    // Calcular tiempo promedio de respuesta (simulado por ahora)
    const avgResponseTime = '2h 15m';

    res.json({
      success: true,
      data: {
        newTickets,
        resolvedTickets,
        avgResponseTime
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener KPIs',
      error: error.message
    });
  }
};

/**
 * Obtener agentes de soporte
 */
const getAgents = async (req, res) => {
  try {
    const agents = await SupportAgent.findAll({
      where: { activo: true },
      order: [['nivel', 'ASC'], ['nombre', 'ASC']]
    });

    res.json({
      success: true,
      data: agents.map(a => `${a.nombre} (${a.nivel})`)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener agentes',
      error: error.message
    });
  }
};

/**
 * Obtener un ticket por ID
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await SupportTicket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        id: ticket.numeroTicket,
        odooId: ticket.id,
        user: ticket.emailUsuario,
        subject: ticket.asunto,
        description: ticket.descripcion,
        date: ticket.createdAt.toISOString().split('T')[0],
        status: ticket.estado,
        priority: ticket.prioridad,
        assignedTo: ticket.asignadoA,
        response: ticket.respuesta
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener ticket',
      error: error.message
    });
  }
};

/**
 * Actualizar un ticket
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, prioridad, asignadoA, respuesta } = req.body;

    const ticket = await SupportTicket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }

    const updateData = {};
    if (estado) updateData.estado = estado;
    if (prioridad) updateData.prioridad = prioridad;
    if (asignadoA !== undefined) updateData.asignadoA = asignadoA;
    if (respuesta) updateData.respuesta = respuesta;

    // Si se resuelve, guardar fecha de resolución
    if (estado === 'resuelto') {
      updateData.fechaResolucion = new Date();
    }

    await ticket.update(updateData);

    res.json({
      success: true,
      message: 'Ticket actualizado exitosamente',
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar ticket',
      error: error.message
    });
  }
};

/**
 * Asignar ticket a un agente
 */
const assign = async (req, res) => {
  try {
    const { id } = req.params;
    const { asignadoA } = req.body;

    const ticket = await SupportTicket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }

    await ticket.update({
      asignadoA,
      estado: ticket.estado === 'nuevo' ? 'pendiente' : ticket.estado
    });

    res.json({
      success: true,
      message: 'Ticket asignado exitosamente',
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al asignar ticket',
      error: error.message
    });
  }
};

/**
 * Crear un nuevo ticket
 */
const create = async (req, res) => {
  try {
    const { emailUsuario, asunto, descripcion, prioridad } = req.body;

    const ticket = await SupportTicket.create({
      emailUsuario,
      asunto,
      descripcion,
      prioridad: prioridad || 'media',
      estado: 'nuevo'
    });

    res.status(201).json({
      success: true,
      message: 'Ticket creado exitosamente',
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear ticket',
      error: error.message
    });
  }
};

/**
 * Crear un ticket de soporte desde la página de usuario
 * Esta función es para usuarios normales (no admin)
 */
const createUserTicket = async (req, res) => {
  try {
    const { asunto, descripcion, prioridad } = req.body;
    
    // Obtener email del usuario autenticado
    const emailUsuario = req.user?.correo || req.body.emailUsuario;

    if (!emailUsuario || !asunto || !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: emailUsuario, asunto, descripcion'
      });
    }

    // Generar número de ticket único
    const lastTicket = await SupportTicket.findOne({
      order: [['numeroTicket', 'DESC']]
    });
    const numeroTicket = lastTicket ? lastTicket.numeroTicket + 1 : 1001;

    const ticket = await SupportTicket.create({
      numeroTicket,
      emailUsuario,
      asunto,
      descripcion,
      prioridad: prioridad || 'media',
      estado: 'nuevo'
    });

    res.status(201).json({
      success: true,
      message: 'Tu ticket ha sido enviado. Te responderemos pronto.',
      data: {
        id: ticket.id,
        numeroTicket: ticket.numeroTicket,
        asunto: ticket.asunto,
        estado: ticket.estado
      }
    });
  } catch (error) {
    console.error('Error al crear ticket de usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar el ticket',
      error: error.message
    });
  }
};

module.exports = {
  getAll,
  getKPIs,
  getAgents,
  getById,
  update,
  assign,
  create,
  createUserTicket
};
