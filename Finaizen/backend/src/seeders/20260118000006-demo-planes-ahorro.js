'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('planes_ahorro', [
      // Planes de ahorro del perfil Personal de María
      {
        id: '00000000-0000-0000-0000-000000000401',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        nombre: 'Vacaciones 2026',
        descripcion: 'Viaje familiar a la playa en verano',
        objetivo: 'Disfrutar de unas merecidas vacaciones',
        monto_actual: 400.00,
        monto_meta: 2000.00,
        monto_ahorrar_mensual: 200.00,
        categoria: 'Viajes',
        fecha_inicio: new Date('2024-03-01'),
        fecha_meta: new Date('2026-08-01'),
        estado: 'activo',
        prioridad: 'alta',
        icono: '✈️',
        color: '#4CAF50',
        estrategia: 'consistente',
        notificacion_activa: true,
        tipo_notificacion: 'mensual',
        depositos_realizados: 2,
        historial_ahorros: JSON.stringify([
          { fecha: '2024-03-01', monto: 200, nota: 'Primer depósito' },
          { fecha: '2024-04-01', monto: 200, nota: 'Segundo depósito' }
        ]),
        created_at: new Date('2024-03-01'),
        updated_at: new Date('2024-04-01')
      },
      {
        id: '00000000-0000-0000-0000-000000000402',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        nombre: 'Fondo de Emergencia',
        descripcion: 'Ahorro para imprevistos',
        objetivo: 'Tener un colchón financiero de 3 meses de gastos',
        monto_actual: 1000.00,
        monto_meta: 4500.00,
        monto_ahorrar_mensual: 150.00,
        categoria: 'Personal',
        fecha_inicio: new Date('2024-02-15'),
        fecha_meta: new Date('2026-12-31'),
        estado: 'activo',
        prioridad: 'alta',
        icono: '🚨',
        color: '#FF9800',
        estrategia: 'agresiva',
        notificacion_activa: true,
        tipo_notificacion: 'mensual',
        depositos_realizados: 7,
        historial_ahorros: JSON.stringify([
          { fecha: '2024-02-15', monto: 150, nota: 'Inicio del fondo' },
          { fecha: '2024-03-15', monto: 150, nota: 'Segundo mes' },
          { fecha: '2024-04-15', monto: 150, nota: 'Tercer mes' },
          { fecha: '2024-05-15', monto: 150, nota: 'Cuarto mes' },
          { fecha: '2024-06-15', monto: 150, nota: 'Quinto mes' },
          { fecha: '2024-07-15', monto: 150, nota: 'Sexto mes' },
          { fecha: '2024-08-15', monto: 100, nota: 'Séptimo mes (ajustado)' }
        ]),
        created_at: new Date('2024-02-15'),
        updated_at: new Date('2024-08-15')
      },
      {
        id: '00000000-0000-0000-0000-000000000403',
        perfil_id: '00000000-0000-0000-0000-000000000012',
        nombre: 'Laptop Nueva',
        descripcion: 'MacBook Pro para trabajo',
        objetivo: 'Comprar equipo para mejorar productividad',
        monto_actual: 1200.00,
        monto_meta: 1200.00,
        monto_ahorrar_mensual: 0,
        categoria: 'Educación',
        fecha_inicio: new Date('2024-01-01'),
        fecha_meta: new Date('2024-06-01'),
        estado: 'completado',
        prioridad: 'normal',
        icono: '💻',
        color: '#2196F3',
        estrategia: 'consistente',
        notificacion_activa: false,
        tipo_notificacion: 'mensual',
        depositos_realizados: 6,
        historial_ahorros: JSON.stringify([
          { fecha: '2024-01-01', monto: 200, nota: 'Inicio' },
          { fecha: '2024-02-01', monto: 200, nota: 'Mes 2' },
          { fecha: '2024-03-01', monto: 200, nota: 'Mes 3' },
          { fecha: '2024-04-01', monto: 200, nota: 'Mes 4' },
          { fecha: '2024-05-01', monto: 200, nota: 'Mes 5' },
          { fecha: '2024-06-01', monto: 200, nota: '¡Meta alcanzada!' }
        ]),
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-06-01')
      },
      // Planes de ahorro de Carlos
      {
        id: '00000000-0000-0000-0000-000000000404',
        perfil_id: '00000000-0000-0000-0000-000000000014',
        nombre: 'Enganche de Auto',
        descripcion: 'Ahorro para el enganche de un vehículo nuevo',
        objetivo: 'Comprar auto en 2027',
        monto_actual: 10000.00,
        monto_meta: 50000.00,
        monto_ahorrar_mensual: 2000.00,
        categoria: 'Vehículo',
        fecha_inicio: new Date('2024-03-01'),
        fecha_meta: new Date('2027-03-01'),
        estado: 'activo',
        prioridad: 'alta',
        icono: '🚗',
        color: '#9C27B0',
        estrategia: 'consistente',
        notificacion_activa: true,
        tipo_notificacion: 'mensual',
        depositos_realizados: 5,
        historial_ahorros: JSON.stringify([
          { fecha: '2024-03-01', monto: 2000, nota: 'Primer mes' },
          { fecha: '2024-04-01', monto: 2000, nota: 'Segundo mes' },
          { fecha: '2024-05-01', monto: 2000, nota: 'Tercer mes' },
          { fecha: '2024-06-01', monto: 2000, nota: 'Cuarto mes' },
          { fecha: '2024-07-01', monto: 2000, nota: 'Quinto mes' }
        ]),
        created_at: new Date('2024-03-01'),
        updated_at: new Date('2024-07-01')
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('planes_ahorro', null, {});
  }
};
