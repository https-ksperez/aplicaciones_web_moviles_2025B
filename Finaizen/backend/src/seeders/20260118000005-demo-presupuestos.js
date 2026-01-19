'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('presupuestos', [
      // Presupuestos del perfil Personal de María
      {
        id: '00000000-0000-0000-0000-000000000301',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        categoria: 'Alimentación',
        monto_limite: 400.00,
        monto_gastado: 150.00,
        periodo: 'mensual',
        alerta_en: 80,
        activo: true,
        mes: 1,
        anio: 2026,
        created_at: new Date('2024-02-15'),
        updated_at: new Date('2026-01-18')
      },
      {
        id: '00000000-0000-0000-0000-000000000302',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        categoria: 'Entretenimiento',
        monto_limite: 100.00,
        monto_gastado: 50.00,
        periodo: 'mensual',
        alerta_en: 75,
        activo: true,
        mes: 1,
        anio: 2026,
        created_at: new Date('2024-02-15'),
        updated_at: new Date('2026-01-18')
      },
      {
        id: '00000000-0000-0000-0000-000000000303',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        categoria: 'Servicios',
        monto_limite: 150.00,
        monto_gastado: 110.00,
        periodo: 'mensual',
        alerta_en: 90,
        activo: true,
        mes: 1,
        anio: 2026,
        created_at: new Date('2024-02-15'),
        updated_at: new Date('2026-01-18')
      },
      // Presupuesto del perfil Negocio de María
      {
        id: '00000000-0000-0000-0000-000000000304',
        perfil_id: '00000000-0000-0000-0000-000000000013',
        categoria: 'Otros',
        monto_limite: 1000.00,
        monto_gastado: 500.00,
        periodo: 'mensual',
        alerta_en: 85,
        activo: true,
        mes: 1,
        anio: 2026,
        created_at: new Date('2024-02-20'),
        updated_at: new Date('2026-01-18')
      },
      // Presupuestos de Carlos
      {
        id: '00000000-0000-0000-0000-000000000305',
        perfil_id: '00000000-0000-0000-0000-000000000014',
        categoria: 'Alimentación',
        monto_limite: 5000.00,
        monto_gastado: 3000.00,
        periodo: 'mensual',
        alerta_en: 80,
        activo: true,
        mes: 1,
        anio: 2026,
        created_at: new Date('2024-03-01'),
        updated_at: new Date('2026-01-18')
      },
      {
        id: '00000000-0000-0000-0000-000000000306',
        perfil_id: '00000000-0000-0000-0000-000000000014',
        categoria: 'Transporte',
        monto_limite: 2000.00,
        monto_gastado: 800.00,
        periodo: 'mensual',
        alerta_en: 75,
        activo: true,
        mes: 1,
        anio: 2026,
        created_at: new Date('2024-03-01'),
        updated_at: new Date('2026-01-18')
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('presupuestos', null, {});
  }
};
