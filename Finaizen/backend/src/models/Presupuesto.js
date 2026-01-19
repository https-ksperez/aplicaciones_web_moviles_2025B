const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Presupuesto = sequelize.define('Presupuesto', {
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
    categoria: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    montoLimite: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    montoGastado: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    periodo: {
      type: DataTypes.ENUM('semanal', 'mensual', 'anual'),
      defaultValue: 'mensual'
    },
    alertaEn: {
      type: DataTypes.INTEGER,
      defaultValue: 80,
      validate: {
        min: 0,
        max: 100
      },
      comment: 'Porcentaje para alertar (default: 80%)'
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
    tableName: 'presupuestos',
    timestamps: true,
    underscored: true
  });

  // Métodos de instancia
  Presupuesto.prototype.getPorcentajeGastado = function() {
    if (this.montoLimite === 0) return 0;
    return (this.montoGastado / this.montoLimite) * 100;
  };

  Presupuesto.prototype.getMontoRestante = function() {
    return Math.max(0, this.montoLimite - this.montoGastado);
  };

  Presupuesto.prototype.isExcedido = function() {
    return this.montoGastado > this.montoLimite;
  };

  Presupuesto.prototype.getEstado = function() {
    const porcentaje = this.getPorcentajeGastado();
    
    if (porcentaje >= 100) return 'danger';
    if (porcentaje >= this.alertaEn) return 'warning';
    if (porcentaje >= 50) return 'neutral';
    return 'ok';
  };

  // Asociaciones
  Presupuesto.associate = (models) => {
    Presupuesto.belongsTo(models.Perfil, {
      foreignKey: 'perfilId',
      as: 'perfil'
    });
  };

  return Presupuesto;
};
