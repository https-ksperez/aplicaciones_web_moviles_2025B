const { DataTypes } = require('sequelize');

const CATEGORIAS_INGRESO = [
  'Salario',
  'Freelance',
  'Inversiones',
  'Alquiler',
  'Bonos',
  'Regalos',
  'Otros'
];

module.exports = (sequelize) => {
  const Ingreso = sequelize.define('Ingreso', {
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
      type: DataTypes.ENUM(...CATEGORIAS_INGRESO),
      defaultValue: 'Otros'
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
    tableName: 'ingresos',
    timestamps: true,
    underscored: true
  });

  // Asociaciones
  Ingreso.associate = (models) => {
    Ingreso.belongsTo(models.Perfil, {
      foreignKey: 'perfilId',
      as: 'perfil'
    });
  };

  return Ingreso;
};
