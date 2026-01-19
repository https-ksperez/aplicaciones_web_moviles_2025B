'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const supervisionData = [
      { 
        id: uuidv4(), 
        descripcion: 'Salida al cine', 
        palabra_clave: 'Cine', 
        categoria_detectada: 'Entretenimiento', 
        categoria_correcta: null,
        confianza: 'alta', 
        score: 98, 
        estado: 'Validado',
        regla_creada: false,
        created_at: now, 
        updated_at: now 
      },
      { 
        id: uuidv4(), 
        descripcion: 'Comprar medicina', 
        palabra_clave: 'Medicina', 
        categoria_detectada: 'Salud', 
        categoria_correcta: null,
        confianza: 'media', 
        score: 74, 
        estado: 'Corregir',
        regla_creada: false,
        created_at: now, 
        updated_at: now 
      },
      { 
        id: uuidv4(), 
        descripcion: 'Pago de suscripcion spotify', 
        palabra_clave: 'Pago', 
        categoria_detectada: 'Otros', 
        categoria_correcta: 'Suscripciones',
        confianza: 'baja', 
        score: 45, 
        estado: 'Corregir y crear regla',
        regla_creada: false,
        created_at: now, 
        updated_at: now 
      },
      { 
        id: uuidv4(), 
        descripcion: 'Uber a casa', 
        palabra_clave: 'Uber', 
        categoria_detectada: 'Transporte', 
        categoria_correcta: null,
        confianza: 'media', 
        score: 68, 
        estado: 'Corregir',
        regla_creada: false,
        created_at: now, 
        updated_at: now 
      },
      { 
        id: uuidv4(), 
        descripcion: 'Supermaxi compra semanal', 
        palabra_clave: 'Supermaxi', 
        categoria_detectada: 'Supermercado', 
        categoria_correcta: null,
        confianza: 'alta', 
        score: 99, 
        estado: 'Validado',
        regla_creada: false,
        created_at: now, 
        updated_at: now 
      },
      { 
        id: uuidv4(), 
        descripcion: 'Cuota del gym', 
        palabra_clave: 'Gym', 
        categoria_detectada: 'Salud', 
        categoria_correcta: null,
        confianza: 'alta', 
        score: 92, 
        estado: 'Validado',
        regla_creada: false,
        created_at: now, 
        updated_at: now 
      },
      { 
        id: uuidv4(), 
        descripcion: 'Netflix mensual', 
        palabra_clave: 'Netflix', 
        categoria_detectada: 'Otros', 
        categoria_correcta: 'Suscripciones',
        confianza: 'baja', 
        score: 51, 
        estado: 'Corregir y crear regla',
        regla_creada: false,
        created_at: now, 
        updated_at: now 
      }
    ];

    await queryInterface.bulkInsert('supervision_ia', supervisionData);

    // Agregar algunas reglas de IA predefinidas
    const reglasIA = [
      { id: uuidv4(), palabra_clave: 'Spotify', categoria: 'Suscripciones', activa: true, creado_por: null, created_at: now, updated_at: now },
      { id: uuidv4(), palabra_clave: 'Netflix', categoria: 'Suscripciones', activa: true, creado_por: null, created_at: now, updated_at: now },
      { id: uuidv4(), palabra_clave: 'Uber', categoria: 'Transporte', activa: true, creado_por: null, created_at: now, updated_at: now },
      { id: uuidv4(), palabra_clave: 'Supermaxi', categoria: 'Supermercado', activa: true, creado_por: null, created_at: now, updated_at: now }
    ];

    await queryInterface.bulkInsert('reglas_ia', reglasIA);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('reglas_ia', null, {});
    await queryInterface.bulkDelete('supervision_ia', null, {});
  }
};
