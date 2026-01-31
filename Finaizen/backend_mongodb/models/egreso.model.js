const mongoose = require("mongoose");

const CATEGORIAS_EGRESO = [
  "Alimentación",
  "Transporte",
  "Vivienda",
  "Servicios",
  "Entretenimiento",
  "Salud",
  "Educación",
  "Ropa",
  "Tecnología",
  "Otros",
];

const EgresoSchema = new mongoose.Schema(
  {
    perfilId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Perfil",
      required: [true, "El perfilId es requerido"],
    },
    monto: {
      type: Number,
      required: [true, "El monto es requerido"],
      min: [0, "El monto no puede ser negativo"],
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es requerida"],
      trim: true,
      maxlength: [255, "La descripción no puede exceder 255 caracteres"],
    },
    categoria: {
      type: String,
      enum: CATEGORIAS_EGRESO,
      default: "Otros",
    },
    clasificacionIA: {
      type: String,
      default: null,
    },
    frecuencia: {
      type: String,
      enum: ["diario", "semanal", "mensual", "anual", "ocasional"],
      default: "ocasional",
    },
    diasSemana: {
      type: [Number],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.every((d) => d >= 0 && d <= 6);
        },
        message: "Los días de la semana deben estar entre 0 y 6",
      },
    },
    diaMes: {
      type: Number,
      min: [1, "El día del mes debe ser al menos 1"],
      max: [31, "El día del mes no puede exceder 31"],
      default: null,
    },
    fechaEspecifica: {
      type: Date,
      default: null,
    },
    delay: {
      type: String,
      default: "00:00",
      match: [/^\d{2}:\d{2}$/, "El formato de hora debe ser HH:mm"],
    },
    notificacionActiva: {
      type: Boolean,
      default: false,
    },
    activo: {
      type: Boolean,
      default: true,
    },
    fechaLimite: {
      type: Date,
      default: null,
    },
    proximaEjecucion: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Índice para búsquedas eficientes
EgresoSchema.index({ perfilId: 1, createdAt: -1 });

const Egreso = mongoose.model("Egreso", EgresoSchema);

module.exports = Egreso;
module.exports.CATEGORIAS_EGRESO = CATEGORIAS_EGRESO;
