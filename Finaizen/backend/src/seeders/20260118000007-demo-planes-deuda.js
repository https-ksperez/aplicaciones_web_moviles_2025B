'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('planes_deuda', [
      // Planes de deuda del perfil Personal de María
      {
        id: '00000000-0000-0000-0000-000000000501',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        nombre: 'Tarjeta Visa',
        descripcion: 'Deuda acumulada en tarjeta de crédito',
        categoria: 'Tarjeta de Crédito',
        monto_deuda: 1500.00,
        monto_pagado: 500.00,
        tasa_interes: 18.5,
        cuota_mensual: 150.00,
        fecha_pago: new Date('2026-02-05'),
        estado: 'activo',
        prioridad: 'alta',
        estrategia: 'avalancha',
        acreedor: 'Banco Pichincha',
        numero_contrato: 'VISA-001234',
        icono: '💳',
        color: '#FF6B6B',
        notificacion_activa: true,
        historial_pagos: JSON.stringify([
          { fecha: '2024-11-05', monto: 200, nota: 'Pago inicial' },
          { fecha: '2024-12-05', monto: 150, nota: 'Pago mensual' },
          { fecha: '2025-01-05', monto: 150, nota: 'Pago mensual' }
        ]),
        created_at: new Date('2024-11-01'),
        updated_at: new Date('2025-01-05')
      },
      {
        id: '00000000-0000-0000-0000-000000000502',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        nombre: 'Préstamo Personal',
        descripcion: 'Préstamo para estudios',
        categoria: 'Préstamo Personal',
        monto_deuda: 5000.00,
        monto_pagado: 1000.00,
        tasa_interes: 12.0,
        cuota_mensual: 250.00,
        fecha_pago: new Date('2026-02-15'),
        estado: 'activo',
        prioridad: 'normal',
        estrategia: 'bola_nieve',
        acreedor: 'Cooperativa 29 de Octubre',
        numero_contrato: 'PRES-789456',
        icono: '🏦',
        color: '#4ECDC4',
        notificacion_activa: true,
        historial_pagos: JSON.stringify([
          { fecha: '2024-10-15', monto: 250, nota: 'Primer pago' },
          { fecha: '2024-11-15', monto: 250, nota: 'Segundo pago' },
          { fecha: '2024-12-15', monto: 250, nota: 'Tercer pago' },
          { fecha: '2025-01-15', monto: 250, nota: 'Cuarto pago' }
        ]),
        created_at: new Date('2024-10-01'),
        updated_at: new Date('2025-01-15')
      },
      // Planes de deuda de Carlos
      {
        id: '00000000-0000-0000-0000-000000000503',
        perfil_id: '00000000-0000-0000-0000-000000000014',
        nombre: 'Tarjeta American Express',
        descripcion: 'Deuda de tarjeta corporativa',
        categoria: 'Tarjeta de Crédito',
        monto_deuda: 25000.00,
        monto_pagado: 5000.00,
        tasa_interes: 22.0,
        cuota_mensual: 2000.00,
        fecha_pago: new Date('2026-02-10'),
        estado: 'activo',
        prioridad: 'alta',
        estrategia: 'avalancha',
        acreedor: 'American Express México',
        numero_contrato: 'AMEX-456789',
        icono: '💳',
        color: '#1E88E5',
        notificacion_activa: true,
        historial_pagos: JSON.stringify([
          { fecha: '2024-11-10', monto: 1500, nota: 'Pago inicial' },
          { fecha: '2024-12-10', monto: 2000, nota: 'Pago mensual' },
          { fecha: '2025-01-10', monto: 1500, nota: 'Pago mensual' }
        ]),
        created_at: new Date('2024-11-01'),
        updated_at: new Date('2025-01-10')
      },
      {
        id: '00000000-0000-0000-0000-000000000504',
        perfil_id: '00000000-0000-0000-0000-000000000014',
        nombre: 'Hipoteca',
        descripcion: 'Crédito hipotecario del departamento',
        categoria: 'Hipoteca',
        monto_deuda: 800000.00,
        monto_pagado: 50000.00,
        tasa_interes: 9.5,
        cuota_mensual: 5000.00,
        fecha_pago: new Date('2026-02-01'),
        estado: 'activo',
        prioridad: 'alta',
        estrategia: 'equilibrada',
        acreedor: 'HSBC México',
        numero_contrato: 'HIP-2024-001',
        icono: '🏠',
        color: '#8BC34A',
        notificacion_activa: true,
        historial_pagos: JSON.stringify([
          { fecha: '2024-04-01', monto: 5000, nota: 'Mes 1' },
          { fecha: '2024-05-01', monto: 5000, nota: 'Mes 2' },
          { fecha: '2024-06-01', monto: 5000, nota: 'Mes 3' },
          { fecha: '2024-07-01', monto: 5000, nota: 'Mes 4' },
          { fecha: '2024-08-01', monto: 5000, nota: 'Mes 5' },
          { fecha: '2024-09-01', monto: 5000, nota: 'Mes 6' },
          { fecha: '2024-10-01', monto: 5000, nota: 'Mes 7' },
          { fecha: '2024-11-01', monto: 5000, nota: 'Mes 8' },
          { fecha: '2024-12-01', monto: 5000, nota: 'Mes 9' },
          { fecha: '2025-01-01', monto: 5000, nota: 'Mes 10' }
        ]),
        created_at: new Date('2024-03-01'),
        updated_at: new Date('2025-01-01')
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('planes_deuda', null, {});
  }
};
