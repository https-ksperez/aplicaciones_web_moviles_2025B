/**
 * Seed de Notificaciones para MongoDB
 * Notificaciones de ejemplo para usuarios
 * Tipos válidos: "info", "warning", "success", "error", "logro", "presupuesto", "transaccion"
 */

const getNotificacionesSeedData = (userIds, perfilIds) => {
  return [
    // Notificaciones para María
    {
      userId: userIds.maria,
      perfilId: perfilIds.mariaPersonal,
      tipo: "info",
      titulo: "Bienvenida a Finaizen",
      mensaje: "¡Hola María! Gracias por unirte a Finaizen. Comienza a registrar tus finanzas hoy.",
      icono: "hand-wave",
      leida: true,
      createdAt: new Date("2024-02-15"),
    },
    {
      userId: userIds.maria,
      perfilId: perfilIds.mariaPersonal,
      tipo: "logro",
      titulo: "¡Logro Desbloqueado!",
      mensaje: "Has desbloqueado el logro 'Primer Ingreso'. ¡Sigue así!",
      icono: "trophy",
      leida: true,
      createdAt: new Date("2024-01-15"),
    },
    {
      userId: userIds.maria,
      perfilId: perfilIds.mariaPersonal,
      tipo: "warning",
      titulo: "Presupuesto cerca del límite",
      mensaje: "Tu presupuesto de Alimentación ha alcanzado el 80% del límite mensual.",
      icono: "alert-triangle",
      leida: false,
      createdAt: new Date("2024-01-20"),
    },
    {
      userId: userIds.maria,
      perfilId: perfilIds.mariaPersonal,
      tipo: "info",
      titulo: "Recordatorio de ahorro",
      mensaje: "No olvides hacer tu depósito mensual al plan 'Fondo de Emergencia'.",
      icono: "bell",
      leida: false,
      createdAt: new Date("2024-01-28"),
    },
    // Notificaciones para Carlos
    {
      userId: userIds.carlos,
      perfilId: perfilIds.carlosPersonal,
      tipo: "success",
      titulo: "Bienvenido a Finaizen",
      mensaje: "¡Hola Carlos! Tu cuenta ha sido creada exitosamente.",
      icono: "hand-wave",
      leida: true,
      createdAt: new Date("2024-03-01"),
    },
    {
      userId: userIds.carlos,
      perfilId: perfilIds.carlosPersonal,
      tipo: "info",
      titulo: "Consejo financiero",
      mensaje: "Te recomendamos crear un presupuesto para controlar mejor tus gastos mensuales.",
      icono: "lightbulb",
      leida: false,
      createdAt: new Date("2024-03-02"),
    },
  ];
};

module.exports = { getNotificacionesSeedData };
