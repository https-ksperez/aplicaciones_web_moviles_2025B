/**
 * Seed de Presupuestos para MongoDB
 * Equivalente al seeder 20260118000005-demo-presupuestos.js de PostgreSQL
 */

// Esta función recibe los IDs de los perfiles creados dinámicamente
const getPresupuestosSeedData = (perfilIds) => {
  // perfilIds es un objeto con: { adminPerfil, mariaPersonal, mariaNegocio, carlosPersonal }
  return [
    // Presupuestos del perfil Personal de María
    {
      perfilId: perfilIds.mariaPersonal,
      categoria: "Alimentación",
      montoLimite: 400.0,
      montoGastado: 150.0,
      periodo: "mensual",
      alertaEn: 80,
      activo: true,
      mes: 1,
      anio: 2026,
      createdAt: new Date("2024-02-15"),
      updatedAt: new Date("2026-01-18"),
    },
    {
      perfilId: perfilIds.mariaPersonal,
      categoria: "Entretenimiento",
      montoLimite: 100.0,
      montoGastado: 50.0,
      periodo: "mensual",
      alertaEn: 75,
      activo: true,
      mes: 1,
      anio: 2026,
      createdAt: new Date("2024-02-15"),
      updatedAt: new Date("2026-01-18"),
    },
    {
      perfilId: perfilIds.mariaPersonal,
      categoria: "Servicios",
      montoLimite: 150.0,
      montoGastado: 110.0,
      periodo: "mensual",
      alertaEn: 90,
      activo: true,
      mes: 1,
      anio: 2026,
      createdAt: new Date("2024-02-15"),
      updatedAt: new Date("2026-01-18"),
    },
    // Presupuesto del perfil Negocio de María
    {
      perfilId: perfilIds.mariaNegocio,
      categoria: "Otros",
      montoLimite: 1000.0,
      montoGastado: 500.0,
      periodo: "mensual",
      alertaEn: 85,
      activo: true,
      mes: 1,
      anio: 2026,
      createdAt: new Date("2024-02-20"),
      updatedAt: new Date("2026-01-18"),
    },
    // Presupuestos de Carlos
    {
      perfilId: perfilIds.carlosPersonal,
      categoria: "Alimentación",
      montoLimite: 5000.0,
      montoGastado: 3000.0,
      periodo: "mensual",
      alertaEn: 80,
      activo: true,
      mes: 1,
      anio: 2026,
      createdAt: new Date("2024-03-01"),
      updatedAt: new Date("2026-01-18"),
    },
    {
      perfilId: perfilIds.carlosPersonal,
      categoria: "Transporte",
      montoLimite: 3000.0,
      montoGastado: 1500.0,
      periodo: "mensual",
      alertaEn: 80,
      activo: true,
      mes: 1,
      anio: 2026,
      createdAt: new Date("2024-03-01"),
      updatedAt: new Date("2026-01-18"),
    },
    {
      perfilId: perfilIds.carlosPersonal,
      categoria: "Entretenimiento",
      montoLimite: 2000.0,
      montoGastado: 800.0,
      periodo: "mensual",
      alertaEn: 75,
      activo: true,
      mes: 1,
      anio: 2026,
      createdAt: new Date("2024-03-01"),
      updatedAt: new Date("2026-01-18"),
    },
  ];
};

module.exports = { getPresupuestosSeedData };
