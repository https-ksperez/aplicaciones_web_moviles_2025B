/**
 * Seed de Perfiles para MongoDB
 * Equivalente al seeder 20260118000002-demo-perfiles.js de PostgreSQL
 */

// Esta función recibe los IDs de los usuarios creados dinámicamente
const getPerfilesSeedData = (userIds) => {
  // userIds es un objeto con las referencias: { admin, maria, carlos }
  return [
    {
      userId: userIds.admin,
      nombre: "Admin",
      moneda: "USD",
      simboloMoneda: "$",
      configuracion: { tema: "oscuro", notificaciones: true },
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      userId: userIds.maria,
      nombre: "Personal",
      moneda: "USD",
      simboloMoneda: "$",
      configuracion: { tema: "claro", notificaciones: true },
      createdAt: new Date("2024-02-15"),
      updatedAt: new Date("2024-02-15"),
    },
    {
      userId: userIds.maria,
      nombre: "Negocio",
      moneda: "USD",
      simboloMoneda: "$",
      configuracion: { tema: "claro", notificaciones: false },
      createdAt: new Date("2024-02-20"),
      updatedAt: new Date("2024-02-20"),
    },
    {
      userId: userIds.carlos,
      nombre: "Personal",
      moneda: "MXN",
      simboloMoneda: "$",
      configuracion: { tema: "claro", notificaciones: true },
      createdAt: new Date("2024-03-01"),
      updatedAt: new Date("2024-03-01"),
    },
  ];
};

module.exports = { getPerfilesSeedData };
