/**
 * Seed de Usuarios para MongoDB
 * Equivalente al seeder 20260118000001-demo-users.js de PostgreSQL
 */
const bcrypt = require("bcryptjs");

const getUsersSeedData = async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const hashedPassword2 = await bcrypt.hash("maria123", 10);
  const hashedPassword3 = await bcrypt.hash("carlos123", 10);

  return [
    {
      nombre: "Admin",
      apellido: "Sistema",
      correo: "admin@finaizen.com",
      nombreUsuario: "admin",
      contraseña: hashedPassword,
      pais: "Ecuador",
      ciudad: "Quito",
      fechaNacimiento: new Date("1990-01-01"),
      genero: "otro",
      rol: "admin",
      isPremium: true,
      premiumSince: null,
      subscriptionType: null,
      subscriptionEndDate: null,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      nombre: "María",
      apellido: "González",
      correo: "maria@example.com",
      nombreUsuario: "maria.gonzalez",
      contraseña: hashedPassword2,
      pais: "Ecuador",
      ciudad: "Guayaquil",
      fechaNacimiento: new Date("1995-03-20"),
      genero: "femenino",
      rol: "user",
      isPremium: true,
      premiumSince: new Date("2024-02-15"),
      subscriptionType: "anual",
      subscriptionEndDate: new Date("2027-02-15"),
      createdAt: new Date("2024-02-15"),
      updatedAt: new Date("2024-02-15"),
    },
    {
      nombre: "Carlos",
      apellido: "Ramírez",
      correo: "carlos@example.com",
      nombreUsuario: "carlos.ramirez",
      contraseña: hashedPassword3,
      pais: "México",
      ciudad: "Ciudad de México",
      fechaNacimiento: new Date("1992-08-10"),
      genero: "masculino",
      rol: "user",
      isPremium: false,
      premiumSince: null,
      subscriptionType: null,
      subscriptionEndDate: null,
      createdAt: new Date("2024-03-01"),
      updatedAt: new Date("2024-03-01"),
    },
  ];
};

module.exports = { getUsersSeedData };
