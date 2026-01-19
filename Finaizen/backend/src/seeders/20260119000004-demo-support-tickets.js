'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Agentes de soporte
    const agents = [
      { id: uuidv4(), nombre: 'Ana', nivel: 'Soporte N1', activo: true, created_at: now, updated_at: now },
      { id: uuidv4(), nombre: 'Carlos', nivel: 'Soporte N1', activo: true, created_at: now, updated_at: now },
      { id: uuidv4(), nombre: 'Laura', nivel: 'Soporte Técnico N2', activo: true, created_at: now, updated_at: now },
      { id: uuidv4(), nombre: 'Equipo de TI', nivel: 'Escalar', activo: true, created_at: now, updated_at: now }
    ];

    await queryInterface.bulkInsert('support_agents', agents);

    // Tickets de soporte - usando secuencia manual para numero_ticket
    const tickets = [
      { 
        id: uuidv4(), 
        email_usuario: 'marta.f@gmail.com', 
        asunto: 'Ingreso semanal no se registra', 
        descripcion: 'Cuando intento registrar un ingreso semanal, el sistema no lo guarda correctamente.',
        estado: 'nuevo',
        prioridad: 'media',
        asignado_a: null,
        respuesta: null,
        fecha_resolucion: null,
        created_at: new Date('2025-10-18'), 
        updated_at: now 
      },
      { 
        id: uuidv4(), 
        email_usuario: 'juan.p@hotmail.com', 
        asunto: 'No puedo editar un gasto guardado', 
        descripcion: 'Intento editar un gasto pero el botón de guardar no funciona.',
        estado: 'pendiente',
        prioridad: 'media',
        asignado_a: 'Ana (Soporte N1)',
        respuesta: null,
        fecha_resolucion: null,
        created_at: new Date('2025-10-18'), 
        updated_at: now 
      },
      { 
        id: uuidv4(), 
        email_usuario: 'ana.g@company.com', 
        asunto: 'Sugerencia: Agregar recordatorios', 
        descripcion: 'Sería útil tener recordatorios para pagos recurrentes.',
        estado: 'resuelto',
        prioridad: 'baja',
        asignado_a: 'Carlos (Soporte N1)',
        respuesta: 'Gracias por su sugerencia. La hemos agregado a nuestra lista de mejoras para futuras versiones.',
        fecha_resolucion: new Date('2025-10-17'),
        created_at: new Date('2025-10-17'), 
        updated_at: now 
      },
      { 
        id: uuidv4(), 
        email_usuario: 'carlos.m@yahoo.com', 
        asunto: 'Error en el cálculo del resumen mensual', 
        descripcion: 'Los totales del resumen mensual no coinciden con mis registros.',
        estado: 'escalado',
        prioridad: 'alta',
        asignado_a: 'Equipo de TI (Escalar)',
        respuesta: null,
        fecha_resolucion: null,
        created_at: new Date('2025-10-17'), 
        updated_at: now 
      },
      { 
        id: uuidv4(), 
        email_usuario: 'luis.r@gmail.com', 
        asunto: 'Mi categoría de "Mascotas" no aparece', 
        descripcion: 'Creé una categoría personalizada pero no aparece en el selector.',
        estado: 'resuelto',
        prioridad: 'media',
        asignado_a: 'Laura (Soporte Técnico N2)',
        respuesta: 'El problema fue resuelto. Las categorías personalizadas ahora aparecen correctamente.',
        fecha_resolucion: new Date('2025-10-16'),
        created_at: new Date('2025-10-16'), 
        updated_at: now 
      },
      { 
        id: uuidv4(), 
        email_usuario: 'maria.l@empresa.com', 
        asunto: 'Problema con la frecuencia anual', 
        descripcion: 'No puedo seleccionar frecuencia anual para mis ingresos.',
        estado: 'nuevo',
        prioridad: 'media',
        asignado_a: null,
        respuesta: null,
        fecha_resolucion: null,
        created_at: new Date('2025-10-16'), 
        updated_at: now 
      }
    ];

    await queryInterface.bulkInsert('support_tickets', tickets);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('support_tickets', null, {});
    await queryInterface.bulkDelete('support_agents', null, {});
  }
};
