'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('perfiles', [
      {
        id: '00000000-0000-0000-0000-000000000011',
        user_id: '00000000-0000-0000-0000-000000000001',
        nombre: 'Admin',
        moneda: 'USD',
        simbolo_moneda: '$',
        configuracion: JSON.stringify({ tema: 'oscuro', notificaciones: true }),
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01')
      },
      {
        id: '00000000-0000-0000-0000-000000000012',
        user_id: '00000000-0000-0000-0000-000000000002',
        nombre: 'Personal',
        moneda: 'USD',
        simbolo_moneda: '$',
        configuracion: JSON.stringify({ tema: 'claro', notificaciones: true }),
        created_at: new Date('2024-02-15'),
        updated_at: new Date('2024-02-15')
      },
      {
        id: '00000000-0000-0000-0000-000000000013',
        user_id: '00000000-0000-0000-0000-000000000002',
        nombre: 'Negocio',
        moneda: 'USD',
        simbolo_moneda: '$',
        configuracion: JSON.stringify({ tema: 'claro', notificaciones: false }),
        created_at: new Date('2024-02-20'),
        updated_at: new Date('2024-02-20')
      },
      {
        id: '00000000-0000-0000-0000-000000000014',
        user_id: '00000000-0000-0000-0000-000000000003',
        nombre: 'Personal',
        moneda: 'MXN',
        simbolo_moneda: '$',
        configuracion: JSON.stringify({ tema: 'claro', notificaciones: true }),
        created_at: new Date('2024-03-01'),
        updated_at: new Date('2024-03-01')
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('perfiles', null, {});
  }
};
