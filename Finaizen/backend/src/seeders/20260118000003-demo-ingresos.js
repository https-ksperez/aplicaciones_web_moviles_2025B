'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ingresos', [
      // Ingresos del perfil Personal de María
      {
        id: '00000000-0000-0000-0000-000000000101',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        monto: 1500.00,
        descripcion: 'Salario Mensual',
        categoria: 'Salario',
        frecuencia: 'mensual',
        dia_mes: 5,
        delay: '09:00',
        notificacion_activa: true,
        activo: true,
        proxima_ejecucion: new Date('2026-02-05'),
        created_at: new Date('2024-02-15'),
        updated_at: new Date('2024-02-15')
      },
      {
        id: '00000000-0000-0000-0000-000000000102',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        monto: 300.00,
        descripcion: 'Proyecto Freelance',
        categoria: 'Freelance',
        frecuencia: 'ocasional',
        fecha_especifica: new Date('2024-11-15'),
        activo: false,
        created_at: new Date('2024-02-20'),
        updated_at: new Date('2024-02-20')
      },
      {
        id: '00000000-0000-0000-0000-000000000103',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        monto: 100.00,
        descripcion: 'Bono Trimestral',
        categoria: 'Bonos',
        frecuencia: 'ocasional',
        dia_mes: 1,
        notificacion_activa: false,
        activo: true,
        proxima_ejecucion: new Date('2026-04-01'),
        created_at: new Date('2024-02-22'),
        updated_at: new Date('2024-02-22')
      },
      // Ingresos del perfil Negocio de María
      {
        id: '00000000-0000-0000-0000-000000000104',
        perfil_id: '00000000-0000-0000-0000-000000000013',
        monto: 2500.00,
        descripcion: 'Ventas del Mes',
        categoria: 'Otros',
        frecuencia: 'mensual',
        dia_mes: 1,
        notificacion_activa: true,
        activo: true,
        proxima_ejecucion: new Date('2026-02-01'),
        created_at: new Date('2024-02-20'),
        updated_at: new Date('2024-02-20')
      },
      // Ingresos de Carlos
      {
        id: '00000000-0000-0000-0000-000000000105',
        perfil_id: '00000000-0000-0000-0000-000000000014',
        monto: 18000.00,
        descripcion: 'Salario Mensual',
        categoria: 'Salario',
        frecuencia: 'mensual',
        dia_mes: 15,
        notificacion_activa: true,
        activo: true,
        proxima_ejecucion: new Date('2026-02-15'),
        created_at: new Date('2024-03-01'),
        updated_at: new Date('2024-03-01')
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ingresos', null, {});
  }
};
