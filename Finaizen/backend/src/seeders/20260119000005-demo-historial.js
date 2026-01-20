'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Crear datos de historial para el perfil de María (Personal)
    const perfilPersonalId = '00000000-0000-0000-0000-000000000012';
    const perfilNegocioId = '00000000-0000-0000-0000-000000000013';
    
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    const historialData = [
      // Historial del perfil Personal de María
      {
        id: uuidv4(),
        perfil_id: perfilPersonalId,
        tipo: 'ingreso',
        monto: 1500.00,
        descripcion: 'Salario Mensual',
        categoria: 'Salario',
        transaccion_origen_id: null,
        fecha_ejecucion: new Date(currentYear, currentMonth - 1, 5),
        mes: currentMonth,
        anio: currentYear,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        perfil_id: perfilPersonalId,
        tipo: 'egreso',
        monto: 300.00,
        descripcion: 'Alquiler Departamento',
        categoria: 'Vivienda',
        transaccion_origen_id: null,
        fecha_ejecucion: new Date(currentYear, currentMonth - 1, 1),
        mes: currentMonth,
        anio: currentYear,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        perfil_id: perfilPersonalId,
        tipo: 'egreso',
        monto: 150.00,
        descripcion: 'Compras Supermercado',
        categoria: 'Alimentación',
        transaccion_origen_id: null,
        fecha_ejecucion: new Date(currentYear, currentMonth - 1, 8),
        mes: currentMonth,
        anio: currentYear,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        perfil_id: perfilPersonalId,
        tipo: 'egreso',
        monto: 80.00,
        descripcion: 'Luz y Agua',
        categoria: 'Servicios',
        transaccion_origen_id: null,
        fecha_ejecucion: new Date(currentYear, currentMonth - 1, 10),
        mes: currentMonth,
        anio: currentYear,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        perfil_id: perfilPersonalId,
        tipo: 'ingreso',
        monto: 300.00,
        descripcion: 'Proyecto Freelance',
        categoria: 'Freelance',
        transaccion_origen_id: null,
        fecha_ejecucion: new Date(currentYear, currentMonth - 1, 15),
        mes: currentMonth,
        anio: currentYear,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        perfil_id: perfilPersonalId,
        tipo: 'egreso',
        monto: 30.00,
        descripcion: 'Internet',
        categoria: 'Servicios',
        transaccion_origen_id: null,
        fecha_ejecucion: new Date(currentYear, currentMonth - 1, 5),
        mes: currentMonth,
        anio: currentYear,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        perfil_id: perfilPersonalId,
        tipo: 'egreso',
        monto: 50.00,
        descripcion: 'Cena con amigos',
        categoria: 'Entretenimiento',
        transaccion_origen_id: null,
        fecha_ejecucion: new Date(currentYear, currentMonth - 1, 12),
        mes: currentMonth,
        anio: currentYear,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        perfil_id: perfilPersonalId,
        tipo: 'egreso',
        monto: 25.00,
        descripcion: 'Taxi al trabajo',
        categoria: 'Transporte',
        transaccion_origen_id: null,
        fecha_ejecucion: new Date(currentYear, currentMonth - 1, 3),
        mes: currentMonth,
        anio: currentYear,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Mes anterior
      {
        id: uuidv4(),
        perfil_id: perfilPersonalId,
        tipo: 'ingreso',
        monto: 1500.00,
        descripcion: 'Salario Mensual',
        categoria: 'Salario',
        transaccion_origen_id: null,
        fecha_ejecucion: new Date(currentYear, currentMonth - 2, 5),
        mes: currentMonth - 1 === 0 ? 12 : currentMonth - 1,
        anio: currentMonth - 1 === 0 ? currentYear - 1 : currentYear,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        perfil_id: perfilPersonalId,
        tipo: 'ingreso',
        monto: 100.00,
        descripcion: 'Bono de Navidad',
        categoria: 'Bonos',
        transaccion_origen_id: null,
        fecha_ejecucion: new Date(currentYear, currentMonth - 2, 20),
        mes: currentMonth - 1 === 0 ? 12 : currentMonth - 1,
        anio: currentMonth - 1 === 0 ? currentYear - 1 : currentYear,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Historial del perfil Negocio de María
      {
        id: uuidv4(),
        perfil_id: perfilNegocioId,
        tipo: 'ingreso',
        monto: 2500.00,
        descripcion: 'Venta de servicios',
        categoria: 'Ventas',
        transaccion_origen_id: null,
        fecha_ejecucion: new Date(currentYear, currentMonth - 1, 10),
        mes: currentMonth,
        anio: currentYear,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        perfil_id: perfilNegocioId,
        tipo: 'egreso',
        monto: 200.00,
        descripcion: 'Publicidad en redes',
        categoria: 'Marketing',
        transaccion_origen_id: null,
        fecha_ejecucion: new Date(currentYear, currentMonth - 1, 15),
        mes: currentMonth,
        anio: currentYear,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('registro_historial', historialData);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('registro_historial', null, {});
  }
};
