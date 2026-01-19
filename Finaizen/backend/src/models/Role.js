const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    protegido: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'roles',
    timestamps: true,
    underscored: true
  });

  Role.associate = (models) => {
    Role.belongsToMany(models.Permiso, {
      through: 'roles_permisos',
      foreignKey: 'rol_id',
      otherKey: 'permiso_id',
      as: 'permisos'
    });
  };

  // Método para obtener el conteo de usuarios con este rol
  Role.prototype.getUserCount = async function() {
    const { User } = sequelize.models;
    // Si tienes un campo rol en users que referencia roles
    // Por ahora retornamos un valor simulado
    return 0;
  };

  return Role;
};
