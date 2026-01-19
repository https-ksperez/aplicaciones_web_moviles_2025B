const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RegistroHistorial = sequelize.define('RegistroHistorial', {
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
    tipo: {
      type: DataTypes.ENUM('ingreso', 'egreso'),
      allowNull: false
    },
    monto: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    categoria: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    transaccionOrigenId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'ID del ingreso o egreso que lo generó'
    },
    fechaEjecucion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    mes: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 12
      }
    },
    anio: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'registro_historial',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: (registro) => {
        const fecha = new Date(registro.fechaEjecucion);
        registro.mes = fecha.getMonth() + 1;
        registro.anio = fecha.getFullYear();
      }
    }
  });

  // Métodos de instancia
  RegistroHistorial.prototype.esIngreso = function() {
    return this.tipo === 'ingreso';
  };

  RegistroHistorial.prototype.esEgreso = function() {
    return this.tipo === 'egreso';
  };

  RegistroHistorial.prototype.getMontoConSigno = function() {
    return this.esIngreso() ? parseFloat(this.monto) : -parseFloat(this.monto);
  };

  // Asociaciones
  RegistroHistorial.associate = (models) => {
    RegistroHistorial.belongsTo(models.Perfil, {
      foreignKey: 'perfilId',
      as: 'perfil'
    });
  };

  return RegistroHistorial;
};
