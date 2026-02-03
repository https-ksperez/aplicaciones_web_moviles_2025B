/**
 * Seed de Historial para MongoDB
 * Registros de transacciones históricas
 */

const getHistorialSeedData = (perfilIds) => {
  return [
    // Historial para perfil Personal de María
    {
      perfilId: perfilIds.mariaPersonal,
      tipo: "ingreso",
      monto: 3500.0,
      descripcion: "Salario mensual Enero",
      categoria: "Salario",
      fechaEjecucion: new Date("2024-01-15"),
      mes: 1,
      anio: 2024,
    },
    {
      perfilId: perfilIds.mariaPersonal,
      tipo: "egreso",
      monto: 150.0,
      descripcion: "Compra supermercado",
      categoria: "Alimentación",
      fechaEjecucion: new Date("2024-01-18"),
      mes: 1,
      anio: 2024,
    },
    {
      perfilId: perfilIds.mariaPersonal,
      tipo: "egreso",
      monto: 800.0,
      descripcion: "Pago alquiler",
      categoria: "Vivienda",
      fechaEjecucion: new Date("2024-01-05"),
      mes: 1,
      anio: 2024,
    },
    {
      perfilId: perfilIds.mariaPersonal,
      tipo: "ingreso",
      monto: 200.0,
      descripcion: "Freelance diseño web",
      categoria: "Freelance",
      fechaEjecucion: new Date("2024-01-22"),
      mes: 1,
      anio: 2024,
    },
    // Historial para perfil Personal de Carlos
    {
      perfilId: perfilIds.carlosPersonal,
      tipo: "ingreso",
      monto: 2800.0,
      descripcion: "Salario Enero",
      categoria: "Salario",
      fechaEjecucion: new Date("2024-01-30"),
      mes: 1,
      anio: 2024,
    },
    {
      perfilId: perfilIds.carlosPersonal,
      tipo: "egreso",
      monto: 50.0,
      descripcion: "Netflix y Spotify",
      categoria: "Entretenimiento",
      fechaEjecucion: new Date("2024-01-10"),
      mes: 1,
      anio: 2024,
    },
    {
      perfilId: perfilIds.carlosPersonal,
      tipo: "egreso",
      monto: 300.0,
      descripcion: "Gasolina mensual",
      categoria: "Transporte",
      fechaEjecucion: new Date("2024-01-25"),
      mes: 1,
      anio: 2024,
    },
  ];
};

module.exports = { getHistorialSeedData };
