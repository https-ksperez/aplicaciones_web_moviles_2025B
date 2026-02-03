const mongoose = require("mongoose");

const TIPOS_NOTIFICACION = [
  "info",
  "warning",
  "success",
  "error",
  "logro",
  "presupuesto",
  "transaccion",
];

const NotificacionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El userId es requerido"],
    },
    perfilId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Perfil",
      default: null,
    },
    tipo: {
      type: String,
      enum: TIPOS_NOTIFICACION,
      required: [true, "El tipo es requerido"],
    },
    titulo: {
      type: String,
      required: [true, "El título es requerido"],
      trim: true,
      maxlength: [255, "El título no puede exceder 255 caracteres"],
    },
    mensaje: {
      type: String,
      required: [true, "El mensaje es requerido"],
    },
    icono: {
      type: String,
      default: "🔔",
    },
    leida: {
      type: Boolean,
      default: false,
    },
    accionUrl: {
      type: String,
      default: null,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Índices para búsquedas eficientes
NotificacionSchema.index({ userId: 1, leida: 1 });
NotificacionSchema.index({ createdAt: -1 });

const Notificacion = mongoose.model("Notificacion", NotificacionSchema);

module.exports = Notificacion;
module.exports.TIPOS_NOTIFICACION = TIPOS_NOTIFICACION;
