const mongoose = require("mongoose");

const TIPOS_LOGRO = [
  "ahorro",
  "racha",
  "presupuesto",
  "registro",
  "especial",
  "empresa",
];

const LogroSchema = new mongoose.Schema(
  {
    perfilId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Perfil",
      required: [true, "El perfilId es requerido"],
    },
    nombre: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
      maxlength: [255, "El nombre no puede exceder 255 caracteres"],
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es requerida"],
    },
    icono: {
      type: String,
      default: "🏆",
    },
    tipo: {
      type: String,
      enum: TIPOS_LOGRO,
      required: [true, "El tipo es requerido"],
    },
    condicion: {
      type: String,
      required: [true, "La condición es requerida"],
    },
    desbloqueado: {
      type: Boolean,
      default: false,
    },
    fechaDesbloqueo: {
      type: Date,
      default: null,
    },
    progreso: {
      type: Number,
      default: 0,
      min: 0,
    },
    meta: {
      type: Number,
      default: 100,
      min: 1,
    },
    // Campos para recompensas de empresas
    empresa: {
      type: String,
      default: null,
    },
    logoEmpresa: {
      type: String,
      default: null,
    },
    recompensa: {
      type: String,
      default: null,
    },
    codigoRecompensa: {
      type: String,
      default: null,
    },
    fechaExpiracion: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Método para calcular porcentaje de progreso
LogroSchema.methods.getPorcentajeProgreso = function () {
  if (this.meta === 0) return 100;
  return Math.min(100, (this.progreso / this.meta) * 100);
};

// Método para verificar si está completo
LogroSchema.methods.isCompleto = function () {
  return this.progreso >= this.meta;
};

// Índice para búsquedas eficientes
LogroSchema.index({ perfilId: 1, desbloqueado: 1 });

const Logro = mongoose.model("Logro", LogroSchema);

module.exports = Logro;
module.exports.TIPOS_LOGRO = TIPOS_LOGRO;
