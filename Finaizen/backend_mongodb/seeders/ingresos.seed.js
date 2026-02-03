/**
 * Seed de Ingresos para MongoDB
 * Equivalente al seeder 20260118000003-demo-ingresos.js de PostgreSQL
 */

// Esta función recibe los IDs de los perfiles creados dinámicamente
const getIngresosSeedData = (perfilIds) => {
  // perfilIds es un objeto con: { adminPerfil, mariaPersonal, mariaNegocio, carlosPersonal }
  return [
    // Ingresos del perfil Personal de María
    {
      perfilId: perfilIds.mariaPersonal,
      monto: 1500.0,
      descripcion: "Salario Mensual",
      categoria: "Salario",
      frecuencia: "mensual",
      diaMes: 5,
      delay: "09:00",
      notificacionActiva: true,
      activo: true,
      proximaEjecucion: new Date("2026-02-05"),
      createdAt: new Date("2024-02-15"),
      updatedAt: new Date("2024-02-15"),
    },
    {
      perfilId: perfilIds.mariaPersonal,
      monto: 300.0,
      descripcion: "Proyecto Freelance",
      categoria: "Freelance",
      frecuencia: "ocasional",
      fechaEspecifica: new Date("2024-11-15"),
      activo: false,
      createdAt: new Date("2024-02-20"),
      updatedAt: new Date("2024-02-20"),
    },
    {
      perfilId: perfilIds.mariaPersonal,
      monto: 100.0,
      descripcion: "Bono Trimestral",
      categoria: "Bonos",
      frecuencia: "ocasional",
      diaMes: 1,
      notificacionActiva: false,
      activo: true,
      proximaEjecucion: new Date("2026-04-01"),
      createdAt: new Date("2024-02-22"),
      updatedAt: new Date("2024-02-22"),
    },
    // Ingresos del perfil Negocio de María
    {
      perfilId: perfilIds.mariaNegocio,
      monto: 2500.0,
      descripcion: "Ventas del Mes",
      categoria: "Otros",
      frecuencia: "mensual",
      diaMes: 1,
      notificacionActiva: true,
      activo: true,
      proximaEjecucion: new Date("2026-02-01"),
      createdAt: new Date("2024-02-20"),
      updatedAt: new Date("2024-02-20"),
    },
    // Ingresos de Carlos
    {
      perfilId: perfilIds.carlosPersonal,
      monto: 18000.0,
      descripcion: "Salario Mensual",
      categoria: "Salario",
      frecuencia: "mensual",
      diaMes: 15,
      notificacionActiva: true,
      activo: true,
      proximaEjecucion: new Date("2026-02-15"),
      createdAt: new Date("2024-03-01"),
      updatedAt: new Date("2024-03-01"),
    },
  ];
};

module.exports = { getIngresosSeedData };
