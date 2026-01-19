/**
 * Servicio de Tareas Programadas (Scheduler)
 * 
 * Este servicio ejecuta automáticamente las transacciones recurrentes
 * cuando llega su hora programada, creando registros en el historial.
 */

const cron = require('node-cron');
const { Ingreso, Egreso, RegistroHistorial, Perfil, Notificacion } = require('../models');
const { Op } = require('sequelize');

/**
 * Verificar si hoy corresponde ejecutar según la frecuencia
 */
const debeEjecutarHoy = (transaccion) => {
  const ahora = new Date();
  const diaActual = ahora.getDay(); // 0=Domingo, 1=Lunes...
  const diaDelMes = ahora.getDate();
  const mesActual = ahora.getMonth() + 1;
  const anioActual = ahora.getFullYear();

  // Verificar si hay fecha límite y ya pasó
  if (transaccion.fechaLimite) {
    const fechaLimite = new Date(transaccion.fechaLimite);
    if (ahora > fechaLimite) {
      return false;
    }
  }

  switch (transaccion.frecuencia) {
    case 'diario':
      return true;

    case 'semanal':
      // diasSemana es un array [0,1,2,...] donde 0=Domingo
      return transaccion.diasSemana && 
             Array.isArray(transaccion.diasSemana) && 
             transaccion.diasSemana.includes(diaActual);

    case 'mensual':
      // diaMes es el día del mes (1-31)
      return transaccion.diaMes === diaDelMes;

    case 'anual':
      // fechaEspecifica para transacciones anuales
      if (transaccion.fechaEspecifica) {
        const fechaEsp = new Date(transaccion.fechaEspecifica);
        return fechaEsp.getDate() === diaDelMes && 
               (fechaEsp.getMonth() + 1) === mesActual;
      }
      return false;

    case 'ocasional':
      // Las ocasionales ya se ejecutaron, no se repiten
      return false;

    default:
      return false;
  }
};

/**
 * Verificar si ya se ejecutó hoy (evitar duplicados)
 */
const yaSeEjecutoHoy = async (transaccionId, tipo) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const maniana = new Date(hoy);
  maniana.setDate(maniana.getDate() + 1);

  const existente = await RegistroHistorial.findOne({
    where: {
      transaccionOrigenId: transaccionId,
      tipo: tipo,
      fechaEjecucion: {
        [Op.gte]: hoy,
        [Op.lt]: maniana
      }
    }
  });

  return !!existente;
};

/**
 * Ejecutar una transacción (crear registro en historial)
 */
const ejecutarTransaccion = async (transaccion, tipo) => {
  try {
    // Verificar si ya se ejecutó hoy
    const yaEjecutado = await yaSeEjecutoHoy(transaccion.id, tipo);
    if (yaEjecutado) {
      console.log(`⏭️ Transacción ${tipo} "${transaccion.descripcion}" ya ejecutada hoy`);
      return null;
    }

    // Crear registro en historial
    const registro = await RegistroHistorial.create({
      perfilId: transaccion.perfilId,
      tipo: tipo,
      monto: transaccion.monto,
      descripcion: transaccion.descripcion,
      categoria: transaccion.categoria,
      transaccionOrigenId: transaccion.id,
      fechaEjecucion: new Date()
    });

    console.log(`✅ Ejecutado ${tipo}: "${transaccion.descripcion}" - $${transaccion.monto}`);

    // Crear notificación si está activa
    if (transaccion.notificacionActiva) {
      // Obtener el perfil para el userId
      const perfil = await Perfil.findByPk(transaccion.perfilId);
      if (perfil) {
        await Notificacion.create({
          userId: perfil.userId,
          perfilId: transaccion.perfilId,
          tipo: tipo === 'ingreso' ? 'success' : 'info',
          titulo: tipo === 'ingreso' ? '💰 Ingreso registrado' : '💸 Egreso registrado',
          mensaje: `Se ha registrado automáticamente: ${transaccion.descripcion} - $${transaccion.monto}`,
          icono: tipo === 'ingreso' ? '💵' : '🧾'
        });
      }
    }

    // Actualizar próxima ejecución
    await actualizarProximaEjecucion(transaccion, tipo);

    return registro;
  } catch (error) {
    console.error(`❌ Error ejecutando ${tipo} "${transaccion.descripcion}":`, error.message);
    return null;
  }
};

/**
 * Actualizar la próxima fecha de ejecución
 */
const actualizarProximaEjecucion = async (transaccion, tipo) => {
  const ahora = new Date();
  let proximaEjecucion = new Date();

  switch (transaccion.frecuencia) {
    case 'diario':
      proximaEjecucion.setDate(proximaEjecucion.getDate() + 1);
      break;

    case 'semanal':
      // Buscar el próximo día de la semana configurado
      const diasSemana = transaccion.diasSemana || [];
      if (diasSemana.length > 0) {
        let diasBuscados = 0;
        do {
          proximaEjecucion.setDate(proximaEjecucion.getDate() + 1);
          diasBuscados++;
        } while (!diasSemana.includes(proximaEjecucion.getDay()) && diasBuscados < 8);
      }
      break;

    case 'mensual':
      proximaEjecucion.setMonth(proximaEjecucion.getMonth() + 1);
      proximaEjecucion.setDate(transaccion.diaMes || 1);
      break;

    case 'anual':
      proximaEjecucion.setFullYear(proximaEjecucion.getFullYear() + 1);
      break;

    default:
      return;
  }

  // Actualizar en la base de datos
  const Model = tipo === 'ingreso' ? Ingreso : Egreso;
  await Model.update(
    { proximaEjecucion: proximaEjecucion },
    { where: { id: transaccion.id } }
  );
};

/**
 * Procesar todas las transacciones pendientes
 */
const procesarTransaccionesPendientes = async () => {
  console.log('🔄 Procesando transacciones programadas...');
  const ahora = new Date();
  const horaActual = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`;

  try {
    // Obtener todos los ingresos activos
    const ingresos = await Ingreso.findAll({
      where: {
        activo: true,
        frecuencia: {
          [Op.ne]: 'ocasional'
        }
      }
    });

    // Obtener todos los egresos activos
    const egresos = await Egreso.findAll({
      where: {
        activo: true,
        frecuencia: {
          [Op.ne]: 'ocasional'
        }
      }
    });

    let ejecutados = 0;

    // Procesar ingresos
    for (const ingreso of ingresos) {
      // Verificar si el delay (hora) coincide con la hora actual (tolerancia de 1 minuto)
      const horaTransaccion = ingreso.delay || '00:00';
      
      if (debeEjecutarHoy(ingreso) && verificarHora(horaTransaccion, horaActual)) {
        const resultado = await ejecutarTransaccion(ingreso, 'ingreso');
        if (resultado) ejecutados++;
      }
    }

    // Procesar egresos
    for (const egreso of egresos) {
      const horaTransaccion = egreso.delay || '00:00';
      
      if (debeEjecutarHoy(egreso) && verificarHora(horaTransaccion, horaActual)) {
        const resultado = await ejecutarTransaccion(egreso, 'egreso');
        if (resultado) ejecutados++;
      }
    }

    if (ejecutados > 0) {
      console.log(`📊 Total ejecutados: ${ejecutados} transacciones`);
    }

    return ejecutados;
  } catch (error) {
    console.error('❌ Error procesando transacciones:', error);
    return 0;
  }
};

/**
 * Verificar si la hora de la transacción coincide con la hora actual
 * Con una tolerancia de 5 minutos
 */
const verificarHora = (horaTransaccion, horaActual) => {
  if (!horaTransaccion) return true; // Si no tiene hora, ejecutar

  const [horaT, minT] = horaTransaccion.split(':').map(Number);
  const [horaA, minA] = horaActual.split(':').map(Number);

  const minutosTransaccion = horaT * 60 + minT;
  const minutosActual = horaA * 60 + minA;

  // Tolerancia de 5 minutos
  return Math.abs(minutosTransaccion - minutosActual) <= 5;
};

/**
 * Iniciar el scheduler de tareas programadas
 */
const iniciarScheduler = () => {
  console.log('🕐 Iniciando servicio de tareas programadas...');

  // Ejecutar cada minuto para verificar transacciones pendientes
  cron.schedule('* * * * *', async () => {
    await procesarTransaccionesPendientes();
  });

  // También ejecutar inmediatamente al iniciar
  procesarTransaccionesPendientes();

  console.log('✅ Scheduler de transacciones iniciado - Revisión cada minuto');
};

/**
 * Ejecutar todas las transacciones pendientes de hoy (forzado manual)
 */
const ejecutarPendientesHoy = async () => {
  console.log('🚀 Ejecutando TODAS las transacciones pendientes de hoy...');
  
  try {
    const ingresos = await Ingreso.findAll({
      where: {
        activo: true,
        frecuencia: { [Op.ne]: 'ocasional' }
      }
    });

    const egresos = await Egreso.findAll({
      where: {
        activo: true,
        frecuencia: { [Op.ne]: 'ocasional' }
      }
    });

    let ejecutados = 0;

    for (const ingreso of ingresos) {
      if (debeEjecutarHoy(ingreso)) {
        const resultado = await ejecutarTransaccion(ingreso, 'ingreso');
        if (resultado) ejecutados++;
      }
    }

    for (const egreso of egresos) {
      if (debeEjecutarHoy(egreso)) {
        const resultado = await ejecutarTransaccion(egreso, 'egreso');
        if (resultado) ejecutados++;
      }
    }

    console.log(`✅ Ejecución forzada completada: ${ejecutados} transacciones`);
    return { success: true, ejecutados };
  } catch (error) {
    console.error('❌ Error en ejecución forzada:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  iniciarScheduler,
  procesarTransaccionesPendientes,
  ejecutarPendientesHoy,
  ejecutarTransaccion,
  debeEjecutarHoy
};
