const mongoose = require("mongoose");

const PresupuestoSchema = new mongoose.Schema(
  {
    perfilId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Perfil",
      required: [true, "El perfilId es requerido"],
    },
    categoria: {
      type: String,
      required: [true, "La categoría es requerida"],
      trim: true,
      maxlength: [100, "La categoría no puede exceder 100 caracteres"],
    },
    montoLimite: {
      type: Number,
      required: [true, "El monto límite es requerido"],
      min: [0, "El monto límite no puede ser negativo"],
    },
    montoGastado: {
      type: Number,
      default: 0,
      min: [0, "El monto gastado no puede ser negativo"],
    },
    periodo: {
      type: String,
      enum: ["semanal", "mensual", "anual"],
      default: "mensual",
    },
    alertaEn: {
      type: Number,
      default: 80,
      min: [0, "El porcentaje de alerta debe ser al menos 0"],
      max: [100, "El porcentaje de alerta no puede exceder 100"],
    },
    activo: {
      type: Boolean,
      default: true,
    },
    mes: {
      type: Number,
      min: [1, "El mes debe ser al menos 1"],
      max: [12, "El mes no puede exceder 12"],
    },
    anio: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Métodos de instancia
PresupuestoSchema.methods.getPorcentajeGastado = function () {
  if (this.montoLimite === 0) return 0;
  return (this.montoGastado / this.montoLimite) * 100;
};

PresupuestoSchema.methods.getMontoRestante = function () {
  return Math.max(0, this.montoLimite - this.montoGastado);
};

PresupuestoSchema.methods.isExcedido = function () {
  return this.montoGastado > this.montoLimite;
};

PresupuestoSchema.methods.getEstado = function () {
  const porcentaje = this.getPorcentajeGastado();

  if (porcentaje >= 100) return "danger";
  if (porcentaje >= this.alertaEn) return "warning";
  if (porcentaje >= 50) return "neutral";
  return "ok";
};

// Índice para búsquedas eficientes
PresupuestoSchema.index({ perfilId: 1, categoria: 1 });

const Presupuesto = mongoose.model("Presupuesto", PresupuestoSchema);

module.exports = Presupuesto;
