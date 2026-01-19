'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Permisos
    const permisos = [
      { id: uuidv4(), nombre: 'Acceso Total', descripcion: 'Acceso completo a todas las funcionalidades', created_at: now, updated_at: now },
      { id: uuidv4(), nombre: 'Ver Dashboard', descripcion: 'Ver panel principal de administración', created_at: now, updated_at: now },
      { id: uuidv4(), nombre: 'Gestionar Usuarios', descripcion: 'Crear, editar y eliminar usuarios', created_at: now, updated_at: now },
      { id: uuidv4(), nombre: 'Gestionar Roles', descripcion: 'Administrar roles y permisos', created_at: now, updated_at: now },
      { id: uuidv4(), nombre: 'Ver Inteligencia de Mercado', descripcion: 'Acceder a datos de mercado', created_at: now, updated_at: now },
      { id: uuidv4(), nombre: 'Exportar CSV', descripcion: 'Exportar datos en formato CSV', created_at: now, updated_at: now },
      { id: uuidv4(), nombre: 'Supervisar Categorías IA', descripcion: 'Supervisar categorización automática', created_at: now, updated_at: now },
      { id: uuidv4(), nombre: 'Crear Reglas de IA', descripcion: 'Crear reglas de categorización', created_at: now, updated_at: now },
      { id: uuidv4(), nombre: 'Ver Métricas del Modelo', descripcion: 'Ver estadísticas del modelo IA', created_at: now, updated_at: now },
      { id: uuidv4(), nombre: 'Gestionar Reportes de Soporte', descripcion: 'Administrar tickets de soporte', created_at: now, updated_at: now },
      { id: uuidv4(), nombre: 'Ver Perfil Limitado', descripcion: 'Ver información básica de perfiles', created_at: now, updated_at: now },
      { id: uuidv4(), nombre: 'Acceder a Registros de Seguridad', descripcion: 'Ver logs de seguridad', created_at: now, updated_at: now }
    ];

    await queryInterface.bulkInsert('permisos', permisos);

    // Roles
    const roles = [
      { id: '10000000-0000-0000-0000-000000000001', nombre: 'Administrador de TI', descripcion: 'Acceso total al sistema', protegido: true, created_at: now, updated_at: now },
      { id: '10000000-0000-0000-0000-000000000002', nombre: 'Analista de Datos', descripcion: 'Análisis de datos de mercado', protegido: false, created_at: now, updated_at: now },
      { id: '10000000-0000-0000-0000-000000000003', nombre: 'Supervisor de IA', descripcion: 'Supervisión del modelo de IA', protegido: false, created_at: now, updated_at: now },
      { id: '10000000-0000-0000-0000-000000000004', nombre: 'Agente de Soporte', descripcion: 'Atención de tickets de soporte', protegido: false, created_at: now, updated_at: now }
    ];

    await queryInterface.bulkInsert('roles', roles);

    // Obtener IDs de permisos insertados
    const permisosDb = await queryInterface.sequelize.query(
      'SELECT id, nombre FROM permisos',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const permisoMap = {};
    permisosDb.forEach(p => {
      permisoMap[p.nombre] = p.id;
    });

    // Asignaciones de permisos a roles
    const rolesPermisos = [
      // Administrador de TI - Acceso Total
      { id: uuidv4(), rol_id: '10000000-0000-0000-0000-000000000001', permiso_id: permisoMap['Acceso Total'], created_at: now },
      
      // Analista de Datos
      { id: uuidv4(), rol_id: '10000000-0000-0000-0000-000000000002', permiso_id: permisoMap['Ver Inteligencia de Mercado'], created_at: now },
      { id: uuidv4(), rol_id: '10000000-0000-0000-0000-000000000002', permiso_id: permisoMap['Exportar CSV'], created_at: now },
      { id: uuidv4(), rol_id: '10000000-0000-0000-0000-000000000002', permiso_id: permisoMap['Ver Dashboard'], created_at: now },
      
      // Supervisor de IA
      { id: uuidv4(), rol_id: '10000000-0000-0000-0000-000000000003', permiso_id: permisoMap['Supervisar Categorías IA'], created_at: now },
      { id: uuidv4(), rol_id: '10000000-0000-0000-0000-000000000003', permiso_id: permisoMap['Crear Reglas de IA'], created_at: now },
      { id: uuidv4(), rol_id: '10000000-0000-0000-0000-000000000003', permiso_id: permisoMap['Ver Métricas del Modelo'], created_at: now },
      
      // Agente de Soporte
      { id: uuidv4(), rol_id: '10000000-0000-0000-0000-000000000004', permiso_id: permisoMap['Gestionar Reportes de Soporte'], created_at: now },
      { id: uuidv4(), rol_id: '10000000-0000-0000-0000-000000000004', permiso_id: permisoMap['Ver Perfil Limitado'], created_at: now }
    ];

    await queryInterface.bulkInsert('roles_permisos', rolesPermisos);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles_permisos', null, {});
    await queryInterface.bulkDelete('roles', null, {});
    await queryInterface.bulkDelete('permisos', null, {});
  }
};
