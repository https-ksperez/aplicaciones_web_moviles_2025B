/**
 * Seed de Logros para MongoDB
 * Sistema de logros/achievements para usuarios
 * Tipos válidos: "ahorro", "racha", "presupuesto", "registro", "especial", "empresa"
 */

const getLogrosSeedData = (perfilIds) => {
  return [
    // Logros para María - Personal
    {
      perfilId: perfilIds.mariaPersonal,
      nombre: "Primer Ingreso",
      descripcion: "Registraste tu primer ingreso en la aplicación",
      icono: "trophy",
      tipo: "registro",
      condicion: "Registrar 1 ingreso",
      desbloqueado: true,
      fechaDesbloqueo: new Date("2024-01-15"),
      progreso: 1,
      meta: 1,
    },
    {
      perfilId: perfilIds.mariaPersonal,
      nombre: "Ahorrador Novato",
      descripcion: "Creaste tu primer plan de ahorro",
      icono: "piggy-bank",
      tipo: "ahorro",
      condicion: "Crear 1 plan de ahorro",
      desbloqueado: true,
      fechaDesbloqueo: new Date("2024-02-01"),
      progreso: 1,
      meta: 1,
    },
    {
      perfilId: perfilIds.mariaPersonal,
      nombre: "Presupuesto Maestro",
      descripcion: "Crea 5 presupuestos diferentes",
      icono: "chart-pie",
      tipo: "presupuesto",
      condicion: "Crear 5 presupuestos",
      desbloqueado: false,
      progreso: 3,
      meta: 5,
    },
    {
      perfilId: perfilIds.mariaPersonal,
      nombre: "Organizador Pro",
      descripcion: "Registra 50 transacciones en total",
      icono: "clipboard-list",
      tipo: "registro",
      condicion: "Registrar 50 transacciones",
      desbloqueado: false,
      progreso: 15,
      meta: 50,
    },
    // Logros para Carlos
    {
      perfilId: perfilIds.carlosPersonal,
      nombre: "Primer Registro",
      descripcion: "Registraste tu primera transacción en la aplicación",
      icono: "trophy",
      tipo: "registro",
      condicion: "Registrar 1 transacción",
      desbloqueado: true,
      fechaDesbloqueo: new Date("2024-01-30"),
      progreso: 1,
      meta: 1,
    },
    {
      perfilId: perfilIds.carlosPersonal,
      nombre: "Racha de 7 días",
      descripcion: "Mantén registros durante 7 días seguidos",
      icono: "shield-check",
      tipo: "racha",
      condicion: "7 días consecutivos con registros",
      desbloqueado: false,
      progreso: 3,
      meta: 7,
    },
    {
      perfilId: perfilIds.carlosPersonal,
      nombre: "Ahorrador Especial",
      descripcion: "Alcanza tu primer objetivo de ahorro",
      icono: "check-circle",
      tipo: "especial",
      condicion: "Completar 1 plan de ahorro",
      desbloqueado: false,
      progreso: 0,
      meta: 1,
    },
  ];
};

module.exports = { getLogrosSeedData };
