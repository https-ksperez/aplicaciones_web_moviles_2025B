const { DataTypes } = require('sequelize');

const CATEGORIAS_EGRESO = [
  'Alimentación',
  'Transporte',
  'Vivienda',
  'Servicios',
  'Entretenimiento',
  'Salud',
  'Educación',
  'Ropa',
  'Tecnología',
  'Otros'
];

module.exports = (sequelize) => {
  const Egreso = sequelize.define('Egreso', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    perfilId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'perfiles',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    monto: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    categoria: {
      type: DataTypes.ENUM(...CATEGORIAS_EGRESO),
      defaultValue: 'Otros'
    },
    clasificacionIA: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'clasificacion_ia',
      comment: 'Clasificación sugerida por IA'
    },
    frecuencia: {
      type: DataTypes.ENUM('diario', 'semanal', 'mensual', 'anual', 'ocasional'),
      defaultValue: 'ocasional'
    },
    diasSemana: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
      comment: 'Para frecuencia semanal: [0,1,2,3,4,5,6] (0=Domingo)'
    },
    diaMes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 31
      },
      comment: 'Para frecuencia mensual: día del mes (1-31)'
    },
    fechaEspecifica: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Para frecuencia anual o ocasional'
    },
    delay: {
      type: DataTypes.STRING(5),
      defaultValue: '00:00',
      comment: 'Hora del día para ejecutar (HH:mm)'
    },
    notificacionActiva: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    fechaLimite: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Fecha hasta la cual la transacción recurrente estará activa'
    },
    proximaEjecucion: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Fecha de la próxima ejecución calculada'
    }
  }, {
    tableName: 'egresos',
    timestamps: true,
    underscored: true
  });

  // Asociaciones
  Egreso.associate = (models) => {
    Egreso.belongsTo(models.Perfil, {
      foreignKey: 'perfilId',
      as: 'perfil'
    });
  };

  return Egreso;
};
