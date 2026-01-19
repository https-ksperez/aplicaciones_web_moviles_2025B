'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('egresos', [
      // Egresos del perfil Personal de María
      {
        id: '00000000-0000-0000-0000-000000000201',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        monto: 300.00,
        descripcion: 'Alquiler',
        categoria: 'Vivienda',
        frecuencia: 'mensual',
        dia_mes: 1,
        notificacion_activa: true,
        activo: true,
        proxima_ejecucion: new Date('2026-02-01'),
        created_at: new Date('2024-02-15'),
        updated_at: new Date('2024-02-15')
      },
      {
        id: '00000000-0000-0000-0000-000000000202',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        monto: 150.00,
        descripcion: 'Supermercado',
        categoria: 'Alimentación',
        frecuencia: 'semanal',
        dias_semana: [1],
        notificacion_activa: false,
        activo: true,
        created_at: new Date('2024-02-15'),
        updated_at: new Date('2024-02-15')
      },
      {
        id: '00000000-0000-0000-0000-000000000203',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        monto: 80.00,
        descripcion: 'Luz y Agua',
        categoria: 'Servicios',
        frecuencia: 'mensual',
        dia_mes: 10,
        notificacion_activa: true,
        activo: true,
        proxima_ejecucion: new Date('2026-02-10'),
        created_at: new Date('2024-02-15'),
        updated_at: new Date('2024-02-15')
      },
      {
        id: '00000000-0000-0000-0000-000000000204',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        monto: 30.00,
        descripcion: 'Internet',
        categoria: 'Servicios',
        frecuencia: 'mensual',
        dia_mes: 5,
        notificacion_activa: true,
        activo: true,
        proxima_ejecucion: new Date('2026-02-05'),
        created_at: new Date('2024-02-15'),
        updated_at: new Date('2024-02-15')
      },
      {
        id: '00000000-0000-0000-0000-000000000205',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        monto: 50.00,
        descripcion: 'Cena con amigos',
        categoria: 'Entretenimiento',
        frecuencia: 'ocasional',
        fecha_especifica: new Date('2026-01-15'),
        activo: false,
        clasificacion_ia: 'Restaurante - Comida italiana',
        created_at: new Date('2024-02-20'),
        updated_at: new Date('2024-02-20')
      },
      // Egresos del perfil Negocio de María
      {
        id: '00000000-0000-0000-0000-000000000206',
        perfil_id: '00000000-0000-0000-0000-000000000013',
        monto: 500.00,
        descripcion: 'Inventario',
        categoria: 'Otros',
        frecuencia: 'mensual',
        dia_mes: 15,
        notificacion_activa: true,
        activo: true,
        proxima_ejecucion: new Date('2026-02-15'),
        created_at: new Date('2024-02-20'),
        updated_at: new Date('2024-02-20')
      },
      {
        id: '00000000-0000-0000-0000-000000000207',
        perfil_id: '00000000-0000-0000-0000-000000000013',
        monto: 200.00,
        descripcion: 'Local Comercial',
        categoria: 'Vivienda',
        frecuencia: 'mensual',
        dia_mes: 1,
        notificacion_activa: true,
        activo: true,
        proxima_ejecucion: new Date('2026-02-01'),
        created_at: new Date('2024-02-20'),
        updated_at: new Date('2024-02-20')
      },
      // Egresos de Carlos
      {
        id: '00000000-0000-0000-0000-000000000208',
        perfil_id: '00000000-0000-0000-0000-000000000014',
        monto: 5000.00,
        descripcion: 'Renta Departamento',
        categoria: 'Vivienda',
        frecuencia: 'mensual',
        dia_mes: 1,
        notificacion_activa: true,
        activo: true,
        proxima_ejecucion: new Date('2026-02-01'),
        created_at: new Date('2024-03-01'),
        updated_at: new Date('2024-03-01')
      },
      {
        id: '00000000-0000-0000-0000-000000000209',
        perfil_id: '00000000-0000-0000-0000-000000000014',
        monto: 3000.00,
        descripcion: 'Supermercado Mensual',
        categoria: 'Alimentación',
        frecuencia: 'mensual',
        dia_mes: 5,
        notificacion_activa: false,
        activo: true,
        proxima_ejecucion: new Date('2026-02-05'),
        created_at: new Date('2024-03-01'),
        updated_at: new Date('2024-03-01')
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('egresos', null, {});
  }
};
