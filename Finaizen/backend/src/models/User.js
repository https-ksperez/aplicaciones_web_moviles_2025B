const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    nombreUsuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    contraseña: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    pais: {
      type: DataTypes.STRING(100),
      defaultValue: 'Ecuador'
    },
    ciudad: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    fechaNacimiento: {
      type: DataTypes.DATE,
      allowNull: true
    },
    genero: {
      type: DataTypes.ENUM('masculino', 'femenino', 'otro', 'prefiero_no_decir'),
      defaultValue: 'prefiero_no_decir'
    },
    rol: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user'
    },
    // Campos Premium
    isPremium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_premium'
    },
    premiumSince: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'premium_since'
    },
    subscriptionType: {
      type: DataTypes.ENUM('mensual', 'anual'),
      allowNull: true,
      field: 'subscription_type'
    },
    subscriptionEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'subscription_end_date'
    },
    paymentMethod: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Información del método de pago: { type, last4, expiry }'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.contraseña) {
          const salt = await bcrypt.genSalt(10);
          user.contraseña = await bcrypt.hash(user.contraseña, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('contraseña')) {
          const salt = await bcrypt.genSalt(10);
          user.contraseña = await bcrypt.hash(user.contraseña, salt);
        }
      }
    }
  });

  // Métodos de instancia
  User.prototype.verificarContraseña = async function(contraseña) {
    return await bcrypt.compare(contraseña, this.contraseña);
  };

  User.prototype.getNombreCompleto = function() {
    return `${this.nombre} ${this.apellido}`;
  };

  User.prototype.getEdad = function() {
    if (!this.fechaNacimiento) return null;
    const today = new Date();
    const birthDate = new Date(this.fechaNacimiento);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  User.prototype.esAdmin = function() {
    return this.rol === 'admin';
  };

  // Método para serializar usuario (quitar contraseña)
  User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.contraseña;
    return values;
  };

  // Asociaciones
  User.associate = (models) => {
    User.hasMany(models.Perfil, {
      foreignKey: 'userId',
      as: 'perfiles'
    });
    User.hasMany(models.Notificacion, {
      foreignKey: 'userId',
      as: 'notificaciones'
    });
    User.hasMany(models.SecurityLog, {
      foreignKey: 'userId',
      as: 'securityLogs'
    });
  };

  return User;
};
