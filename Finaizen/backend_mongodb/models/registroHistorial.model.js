const mongoose = require("mongoose");

const RegistroHistorialSchema = new mongoose.Schema(
  {
    perfilId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Perfil",
      required: [true, "El perfilId es requerido"],
    },
    tipo: {
      type: String,
      enum: ["ingreso", "egreso"],
      required: [true, "El tipo es requerido"],
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
      required: [true, "La categoría es requerida"],
      trim: true,
    },
    transaccionOrigenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingreso",
      default: null,
      required: false,
    },
    fechaEjecucion: {
      type: Date,
      default: Date.now,
    },
    mes: {
      type: Number,
      min: 1,
      max: 12,
    },
    anio: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Hook para calcular mes y año antes de guardar
RegistroHistorialSchema.pre("save", function () {
  const fecha = new Date(this.fechaEjecucion);
  this.mes = fecha.getMonth() + 1;
  this.anio = fecha.getFullYear();
});

// Métodos de instancia
RegistroHistorialSchema.methods.esIngreso = function () {
  return this.tipo === "ingreso";
};

RegistroHistorialSchema.methods.esEgreso = function () {
  return this.tipo === "egreso";
};

RegistroHistorialSchema.methods.getMontoConSigno = function () {
  return this.esIngreso() ? this.monto : -this.monto;
};

// Índice para búsquedas eficientes
RegistroHistorialSchema.index({ perfilId: 1, fechaEjecucion: -1 });
RegistroHistorialSchema.index({ perfilId: 1, mes: 1, anio: 1 });

const RegistroHistorial = mongoose.model("RegistroHistorial", RegistroHistorialSchema);

module.exports = RegistroHistorial;
