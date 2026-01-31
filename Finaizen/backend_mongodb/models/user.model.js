const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
    },
    apellido: {
      type: String,
      required: [true, "El apellido es requerido"],
      trim: true,
      maxlength: [100, "El apellido no puede exceder 100 caracteres"],
    },
    correo: {
      type: String,
      required: [true, "El correo electrónico es requerido"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor ingresa un correo válido",
      ],
    },
    nombreUsuario: {
      type: String,
      required: [true, "El nombre de usuario es requerido"],
      unique: true,
      trim: true,
      minlength: [3, "El nombre de usuario debe tener al menos 3 caracteres"],
      maxlength: [50, "El nombre de usuario no puede exceder 50 caracteres"],
    },
    contraseña: {
      type: String,
      required: [true, "La contraseña es requerida"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    pais: {
      type: String,
      default: "Ecuador",
    },
    ciudad: {
      type: String,
      default: "",
    },
    fechaNacimiento: {
      type: Date,
      default: null,
    },
    genero: {
      type: String,
      enum: ["masculino", "femenino", "otro", "prefiero_no_decir"],
      default: "prefiero_no_decir",
    },
    rol: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // Campos Premium
    isPremium: {
      type: Boolean,
      default: false,
    },
    premiumSince: {
      type: Date,
      default: null,
    },
    subscriptionType: {
      type: String,
      enum: ["mensual", "anual", null],
      default: null,
    },
    subscriptionEndDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt y updatedAt automáticos
  }
);

// Método para comparar contraseñas
UserSchema.methods.compararContraseña = async function (contraseñaIngresada) {
  return await bcrypt.compare(contraseñaIngresada, this.contraseña);
};

// Método para obtener datos públicos del usuario (sin contraseña)
UserSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.contraseña;
  return obj;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
