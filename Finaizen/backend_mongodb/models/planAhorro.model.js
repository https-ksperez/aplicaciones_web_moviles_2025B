const mongoose = require("mongoose");

const CATEGORIAS_PLAN_AHORRO = [
  "Personal",
  "Viajes",
  "Vehículo",
  "Casa",
  "Educación",
  "Otros",
];

const PlanAhorroSchema = new mongoose.Schema(
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
      default: "",
    },
    objetivo: {
      type: String,
      required: [true, "El objetivo es requerido"],
      maxlength: [255, "El objetivo no puede exceder 255 caracteres"],
    },
    montoActual: {
      type: Number,
      default: 0,
      min: [0, "El monto actual no puede ser negativo"],
    },
    montoMeta: {
      type: Number,
      required: [true, "El monto meta es requerido"],
      min: [0, "El monto meta no puede ser negativo"],
    },
    montoAhorrarMensual: {
      type: Number,
      required: [true, "El monto a ahorrar mensual es requerido"],
      min: [0, "El monto a ahorrar no puede ser negativo"],
    },
    categoria: {
      type: String,
      enum: CATEGORIAS_PLAN_AHORRO,
      default: "Personal",
    },
    fechaInicio: {
      type: Date,
      default: Date.now,
    },
    fechaMeta: {
      type: Date,
      required: [true, "La fecha meta es requerida"],
    },
    estado: {
      type: String,
      enum: ["activo", "pausado", "completado", "cancelado"],
      default: "activo",
    },
    prioridad: {
      type: String,
      enum: ["baja", "normal", "alta", "urgente"],
      default: "normal",
    },
    icono: {
      type: String,
      default: "💰",
    },
    color: {
      type: String,
      default: "#4CAF50",
    },
    // Seguimiento
    porcentajeCompletado: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    depositosRealizados: {
      type: Number,
      default: 0,
    },
    mesesRestantes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Método para calcular porcentaje completado
PlanAhorroSchema.methods.calcularPorcentaje = function () {
  if (this.montoMeta === 0) return 0;
  return Math.min(100, (this.montoActual / this.montoMeta) * 100);
};

// Método para calcular meses restantes
PlanAhorroSchema.methods.calcularMesesRestantes = function () {
  const hoy = new Date();
  const meta = new Date(this.fechaMeta);
  const diffTime = meta - hoy;
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
  return Math.max(0, diffMonths);
};

// Pre-save hook para actualizar campos calculados
PlanAhorroSchema.pre("save", function (next) {
  this.porcentajeCompletado = this.calcularPorcentaje();
  this.mesesRestantes = this.calcularMesesRestantes();
  next();
});

// Índice para búsquedas eficientes
PlanAhorroSchema.index({ perfilId: 1, estado: 1 });

const PlanAhorro = mongoose.model("PlanAhorro", PlanAhorroSchema);

module.exports = PlanAhorro;
module.exports.CATEGORIAS_PLAN_AHORRO = CATEGORIAS_PLAN_AHORRO;
