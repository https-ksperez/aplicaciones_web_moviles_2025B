'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('notificaciones', [
      // Notificaciones para María (User 2)
      {
        id: '00000000-0000-0000-0000-000000000901',
        user_id: '00000000-0000-0000-0000-000000000002',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        tipo: 'logro',
        titulo: '¡Estás cerca de un logro!',
        mensaje: 'Solo te faltan 2 meses para completar "Controlador de Gastos". ¡Sigue así!',
        icono: '🏆',
        leida: false,
        accion_url: '/user/logros',
        data: JSON.stringify({ logroId: '00000000-0000-0000-0000-000000000501' }),
        created_at: new Date('2026-01-18T10:00:00'),
        updated_at: new Date('2026-01-18T10:00:00')
      },
      {
        id: '00000000-0000-0000-0000-000000000902',
        user_id: '00000000-0000-0000-0000-000000000002',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        tipo: 'info',
        titulo: '💡 Sugerencia de Ahorro',
        mensaje: 'Basado en tus gastos, podrías ahorrar $50 mensuales reduciendo gastos en entretenimiento.',
        icono: '💡',
        leida: false,
        accion_url: '/user/presupuestos',
        data: null,
        created_at: new Date('2026-01-17T15:30:00'),
        updated_at: new Date('2026-01-17T15:30:00')
      },
      {
        id: '00000000-0000-0000-0000-000000000903',
        user_id: '00000000-0000-0000-0000-000000000002',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        tipo: 'warning',
        titulo: '⚠️ Alerta de Presupuesto',
        mensaje: 'Has alcanzado el 80% de tu presupuesto de Alimentación este mes.',
        icono: '⚠️',
        leida: true,
        accion_url: '/user/presupuestos',
        data: JSON.stringify({ categoria: 'Alimentación', porcentaje: 80 }),
        created_at: new Date('2026-01-15T09:00:00'),
        updated_at: new Date('2026-01-15T09:00:00')
      },
      {
        id: '00000000-0000-0000-0000-000000000904',
        user_id: '00000000-0000-0000-0000-000000000002',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        tipo: 'success',
        titulo: '🎉 ¡Excelente trabajo!',
        mensaje: 'Tu ahorro este mes es un 15% mayor que el mes anterior. ¡Vas por buen camino!',
        icono: '🎉',
        leida: true,
        accion_url: null,
        data: null,
        created_at: new Date('2026-01-10T12:00:00'),
        updated_at: new Date('2026-01-10T12:00:00')
      },
      {
        id: '00000000-0000-0000-0000-000000000905',
        user_id: '00000000-0000-0000-0000-000000000002',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        tipo: 'presupuesto',
        titulo: '📅 Recordatorio de Pago',
        mensaje: 'Recuerda que mañana vence el pago del servicio de Internet ($30).',
        icono: '📅',
        leida: false,
        accion_url: '/user/plan-deuda',
        data: JSON.stringify({ egresoId: '00000000-0000-0000-0000-000000000204' }),
        created_at: new Date('2026-01-19T08:00:00'),
        updated_at: new Date('2026-01-19T08:00:00')
      },
      {
        id: '00000000-0000-0000-0000-000000000906',
        user_id: '00000000-0000-0000-0000-000000000002',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        tipo: 'info',
        titulo: '📚 Tip Financiero del Día',
        mensaje: 'Destina al menos el 10% de tus ingresos al ahorro antes de cualquier gasto.',
        icono: '📚',
        leida: false,
        accion_url: null,
        data: null,
        created_at: new Date('2026-01-19T07:00:00'),
        updated_at: new Date('2026-01-19T07:00:00')
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notificaciones', {
      id: {
        [Sequelize.Op.in]: [
          '00000000-0000-0000-0000-000000000901',
          '00000000-0000-0000-0000-000000000902',
          '00000000-0000-0000-0000-000000000903',
          '00000000-0000-0000-0000-000000000904',
          '00000000-0000-0000-0000-000000000905',
          '00000000-0000-0000-0000-000000000906'
        ]
      }
    }, {});
  }
};
