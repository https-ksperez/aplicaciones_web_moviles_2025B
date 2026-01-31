const mongoose = require("mongoose");

// Monedas por país
const MONEDAS_POR_PAIS = {
  Ecuador: { codigo: "USD", simbolo: "$" },
  "Estados Unidos": { codigo: "USD", simbolo: "$" },
  México: { codigo: "MXN", simbolo: "$" },
  Colombia: { codigo: "COP", simbolo: "$" },
  Perú: { codigo: "PEN", simbolo: "S/" },
  Argentina: { codigo: "ARS", simbolo: "$" },
  Chile: { codigo: "CLP", simbolo: "$" },
  España: { codigo: "EUR", simbolo: "€" },
};

const PerfilSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El userId es requerido"],
    },
    nombre: {
      type: String,
      required: [true, "El nombre del perfil es requerido"],
      trim: true,
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
    },
    moneda: {
      type: String,
      default: "USD",
    },
    simboloMoneda: {
      type: String,
      default: "$",
    },
    configuracion: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Método estático para obtener moneda según país
PerfilSchema.statics.getMonedaPorPais = function (pais) {
  return MONEDAS_POR_PAIS[pais] || { codigo: "USD", simbolo: "$" };
};

const Perfil = mongoose.model("Perfil", PerfilSchema);

module.exports = Perfil;
