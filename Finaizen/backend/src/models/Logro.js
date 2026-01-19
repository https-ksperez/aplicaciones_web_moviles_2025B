const { DataTypes } = require('sequelize');

const TIPOS_LOGRO = [
  'ahorro',
  'racha',
  'presupuesto',
  'registro',
  'especial',
  'empresa'
];

module.exports = (sequelize) => {
  const Logro = sequelize.define('Logro', {
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
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    icono: {
      type: DataTypes.STRING(10),
      defaultValue: '🏆'
    },
    tipo: {
      type: DataTypes.ENUM(...TIPOS_LOGRO),
      allowNull: false
    },
    condicion: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Condición para desbloquear el logro'
    },
    desbloqueado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    fechaDesbloqueo: {
      type: DataTypes.DATE,
      allowNull: true
    },
    progreso: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    meta: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      validate: {
        min: 1
      }
    },
    // Campos para recompensas de empresas
    empresa: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Nombre de la empresa asociada'
    },
    logoEmpresa: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL del logo de la empresa'
    },
    recompensa: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descripción de la recompensa'
    },
    valorRecompensa: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      comment: 'Valor monetario de la recompensa en USD'
    },
    requiereComprobante: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    comprobantes: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array de comprobantes subidos'
    }
  }, {
    tableName: 'logros',
    timestamps: true,
    underscored: true
  });

  // Métodos de instancia
  Logro.prototype.getPorcentajeProgreso = function() {
    return (this.progreso / this.meta) * 100;
  };

  Logro.prototype.actualizarProgreso = function(nuevoProgreso) {
    this.progreso = Math.min(nuevoProgreso, this.meta);
    
    if (this.progreso >= this.meta && !this.desbloqueado) {
      this.desbloquear();
    }
  };

  Logro.prototype.desbloquear = function() {
    this.desbloqueado = true;
    this.fechaDesbloqueo = new Date();
    this.progreso = this.meta;
  };

  Logro.prototype.agregarComprobante = function(urlComprobante) {
    const comprobantes = this.comprobantes || [];
    comprobantes.push({
      url: urlComprobante,
      fecha: new Date(),
      verificado: false
    });
    this.comprobantes = comprobantes;
  };

  // Asociaciones
  Logro.associate = (models) => {
    Logro.belongsTo(models.Perfil, {
      foreignKey: 'perfilId',
      as: 'perfil'
    });
  };

  return Logro;
};
