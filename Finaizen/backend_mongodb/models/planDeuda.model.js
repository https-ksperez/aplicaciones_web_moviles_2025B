const mongoose = require("mongoose");

const CATEGORIAS_PLAN_DEUDA = [
  "Tarjeta de Crédito",
  "Préstamo Personal",
  "Hipoteca",
  "Préstamo Auto",
  "Deuda Familiar",
  "Servicios",
  "Otro",
];

const PlanDeudaSchema = new mongoose.Schema(
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
    categoria: {
      type: String,
      enum: CATEGORIAS_PLAN_DEUDA,
      default: "Otro",
    },
    montoDeuda: {
      type: Number,
      required: [true, "El monto de la deuda es requerido"],
      min: [0, "El monto no puede ser negativo"],
    },
    montoPagado: {
      type: Number,
      default: 0,
      min: [0, "El monto pagado no puede ser negativo"],
    },
    tasaInteres: {
      type: Number,
      default: 0,
      min: [0, "La tasa de interés no puede ser negativa"],
    },
    cuotaMensual: {
      type: Number,
      required: [true, "La cuota mensual es requerida"],
      min: [0, "La cuota no puede ser negativa"],
    },
    fechaPago: {
      type: Date,
      required: [true, "La fecha de pago es requerida"],
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
    estrategia: {
      type: String,
      enum: ["bola_nieve", "avalancha", "equilibrada", "agresiva"],
      default: "equilibrada",
    },
    acreedor: {
      type: String,
      default: "",
    },
    numeroContrato: {
      type: String,
      default: "",
    },
    icono: {
      type: String,
      default: "💳",
    },
    color: {
      type: String,
      default: "#FF6B6B",
    },
    notificacionActiva: {
      type: Boolean,
      default: true,
    },
    historialPagos: {
      type: [
        {
          fecha: { type: Date, required: true },
          monto: { type: Number, required: true },
          nota: { type: String, default: "" },
        },
      ],
      default: [],
    },
    reajustes: {
      type: [
        {
          fecha: { type: Date, required: true },
          descripcion: { type: String, default: "" },
          montoAnterior: { type: Number },
          montoNuevo: { type: Number },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Métodos de instancia
PlanDeudaSchema.methods.getSaldoPendiente = function () {
  return Math.max(0, this.montoDeuda - this.montoPagado);
};

PlanDeudaSchema.methods.getPorcentajePagado = function () {
  if (this.montoDeuda === 0) return 100;
  return Math.min(100, (this.montoPagado / this.montoDeuda) * 100);
};

PlanDeudaSchema.methods.getMesesRestantes = function () {
  const saldo = this.getSaldoPendiente();
  if (this.cuotaMensual <= 0) return 0;
  return Math.ceil(saldo / this.cuotaMensual);
};

PlanDeudaSchema.methods.getEstado = function () {
  const porcentaje = this.getPorcentajePagado();
  if (porcentaje >= 100) return "completado";
  if (porcentaje >= 75) return "avanzado";
  if (porcentaje >= 50) return "medio";
  if (porcentaje >= 25) return "inicio";
  return "pendiente";
};

// Pre-save hook para verificar si está completado
PlanDeudaSchema.pre("save", function (next) {
  if (this.montoPagado >= this.montoDeuda && this.estado === "activo") {
    this.estado = "completado";
  }
  next();
});

// Índice para búsquedas eficientes
PlanDeudaSchema.index({ perfilId: 1, estado: 1 });

const PlanDeuda = mongoose.model("PlanDeuda", PlanDeudaSchema);

module.exports = PlanDeuda;
module.exports.CATEGORIAS_PLAN_DEUDA = CATEGORIAS_PLAN_DEUDA;
