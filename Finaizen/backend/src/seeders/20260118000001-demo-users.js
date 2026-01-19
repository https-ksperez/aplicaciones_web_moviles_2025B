'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const hashedPassword2 = await bcrypt.hash('maria123', 10);
    const hashedPassword3 = await bcrypt.hash('carlos123', 10);

    await queryInterface.bulkInsert('users', [
      {
        id: '00000000-0000-0000-0000-000000000001',
        nombre: 'Admin',
        apellido: 'Sistema',
        correo: 'admin@finaizen.com',
        nombre_usuario: 'admin',
        contraseña: hashedPassword,
        pais: 'Ecuador',
        ciudad: 'Quito',
        fecha_nacimiento: '1990-01-01',
        genero: 'otro',
        rol: 'admin',
        is_premium: true,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01')
      },
      {
        id: '00000000-0000-0000-0000-000000000002',
        nombre: 'María',
        apellido: 'González',
        correo: 'maria@example.com',
        nombre_usuario: 'maria.gonzalez',
        contraseña: hashedPassword2,
        pais: 'Ecuador',
        ciudad: 'Guayaquil',
        fecha_nacimiento: '1995-03-20',
        genero: 'femenino',
        rol: 'user',
        is_premium: true,
        premium_since: new Date('2024-02-15'),
        subscription_type: 'anual',
        subscription_end_date: new Date('2027-02-15'),
        created_at: new Date('2024-02-15'),
        updated_at: new Date('2024-02-15')
      },
      {
        id: '00000000-0000-0000-0000-000000000003',
        nombre: 'Carlos',
        apellido: 'Ramírez',
        correo: 'carlos@example.com',
        nombre_usuario: 'carlos.ramirez',
        contraseña: hashedPassword3,
        pais: 'México',
        ciudad: 'Ciudad de México',
        fecha_nacimiento: '1992-08-10',
        genero: 'masculino',
        rol: 'user',
        is_premium: false,
        created_at: new Date('2024-03-01'),
        updated_at: new Date('2024-03-01')
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
