const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SupervisionIA = sequelize.define('SupervisionIA', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    palabraClave: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'palabra_clave'
    },
    categoriaDetectada: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'categoria_detectada'
    },
    categoriaCorrecta: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'categoria_correcta'
    },
    confianza: {
      type: DataTypes.ENUM('alta', 'media', 'baja'),
      allowNull: false
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    estado: {
      type: DataTypes.ENUM('Validado', 'Corregir', 'Corregir y crear regla', 'Pendiente'),
      defaultValue: 'Pendiente'
    },
    reglaCreada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'regla_creada'
    }
  }, {
    tableName: 'supervision_ia',
    timestamps: true,
    underscored: true
  });

  return SupervisionIA;
};
