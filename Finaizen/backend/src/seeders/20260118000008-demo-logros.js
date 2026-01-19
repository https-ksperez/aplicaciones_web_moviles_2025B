'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('logros', [
      // Logros del perfil Personal de María
      {
        id: '00000000-0000-0000-0000-000000000601',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        nombre: 'Primera Meta Alcanzada',
        descripcion: 'Completa tu primer plan de ahorro',
        icono: '🎯',
        tipo: 'ahorro',
        condicion: 'Completar un plan de ahorro al 100%',
        desbloqueado: true,
        progreso: 100,
        meta: 100,
        empresa: 'Starbucks',
        logo_empresa: 'https://logo.clearbit.com/starbucks.com',
        recompensa: '$5 USD en productos Starbucks',
        valor_recompensa: 5.00,
        requiere_comprobante: true,
        fecha_desbloqueo: new Date('2024-06-01'),
        created_at: new Date('2024-02-15'),
        updated_at: new Date('2024-06-01')
      },
      {
        id: '00000000-0000-0000-0000-000000000602',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        nombre: 'Ahorrador Consistente',
        descripcion: 'Ahorra durante 3 meses consecutivos',
        icono: '💰',
        tipo: 'ahorro',
        condicion: 'Realizar depósitos mensuales durante 3 meses',
        desbloqueado: true,
        progreso: 3,
        meta: 3,
        empresa: 'McDonald\'s',
        logo_empresa: 'https://logo.clearbit.com/mcdonalds.com',
        recompensa: '$10 USD en productos McDonald\'s',
        valor_recompensa: 10.00,
        requiere_comprobante: true,
        fecha_desbloqueo: new Date('2024-05-01'),
        created_at: new Date('2024-02-15'),
        updated_at: new Date('2024-05-01')
      },
      {
        id: '00000000-0000-0000-0000-000000000603',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        nombre: 'Controlador de Gastos',
        descripcion: 'Mantén tus presupuestos bajo control por 2 meses',
        icono: '📊',
        tipo: 'presupuesto',
        condicion: 'No exceder ningún presupuesto durante 2 meses',
        desbloqueado: false,
        progreso: 1,
        meta: 2,
        empresa: 'Cinemark',
        logo_empresa: 'https://logo.clearbit.com/cinemark.com',
        recompensa: '2 entradas de cine gratis',
        valor_recompensa: 15.00,
        requiere_comprobante: false,
        created_at: new Date('2024-02-15'),
        updated_at: new Date('2026-01-18')
      },
      {
        id: '00000000-0000-0000-0000-000000000604',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        nombre: 'Cazador de Deudas',
        descripcion: 'Paga completamente una deuda',
        icono: '🎯',
        tipo: 'registro',
        condicion: 'Liquidar completamente un plan de deuda',
        desbloqueado: false,
        progreso: 33,
        meta: 100,
        empresa: 'Amazon',
        logo_empresa: 'https://logo.clearbit.com/amazon.com',
        recompensa: '$20 USD en cupón Amazon',
        valor_recompensa: 20.00,
        requiere_comprobante: true,
        created_at: new Date('2024-11-01'),
        updated_at: new Date('2026-01-18')
      },
      // Logros de Carlos
      {
        id: '00000000-0000-0000-0000-000000000605',
        perfil_id: '00000000-0000-0000-0000-000000000014',
        nombre: 'Mega Ahorrador',
        descripcion: 'Alcanza $10,000 MXN en ahorro total',
        icono: '💎',
        tipo: 'ahorro',
        condicion: 'Acumular $10,000 MXN en planes de ahorro',
        desbloqueado: true,
        progreso: 10000,
        meta: 10000,
        empresa: 'Liverpool',
        logo_empresa: 'https://logo.clearbit.com/liverpool.com.mx',
        recompensa: '$500 MXN en cupón Liverpool',
        valor_recompensa: 500.00,
        requiere_comprobante: true,
        fecha_desbloqueo: new Date('2024-07-01'),
        created_at: new Date('2024-03-01'),
        updated_at: new Date('2024-07-01')
      },
      {
        id: '00000000-0000-0000-0000-000000000606',
        perfil_id: '00000000-0000-0000-0000-000000000014',
        nombre: 'Destructor de Deudas',
        descripcion: 'Paga $5,000 MXN en deudas',
        icono: '⚔️',
        tipo: 'registro',
        condicion: 'Acumular $5,000 MXN en pagos de deudas',
        desbloqueado: true,
        progreso: 5000,
        meta: 5000,
        empresa: 'Spotify',
        logo_empresa: 'https://logo.clearbit.com/spotify.com',
        recompensa: '3 meses de Spotify Premium',
        valor_recompensa: 299.00,
        requiere_comprobante: false,
        fecha_desbloqueo: new Date('2024-12-10'),
        created_at: new Date('2024-11-01'),
        updated_at: new Date('2024-12-10')
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('logros', null, {});
  }
};
