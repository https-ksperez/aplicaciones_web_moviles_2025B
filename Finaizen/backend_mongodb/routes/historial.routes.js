const historialController = require("../controllers/historial.controller");
const { protectController } = require("../middlewares/auth.middleware");

module.exports = function (app) {
  // Todas las rutas de historial requieren autenticación

  // Rutas para historial por perfil
  app.get("/api/historial/:perfilId", protectController, historialController.getAllHistorial);
  app.get("/api/historial/:perfilId/resumen", protectController, historialController.getResumen);
  app.post("/api/historial/:perfilId", protectController, historialController.createHistorial);

  // Rutas para registro individual
  app.get("/api/historial/detalle/:id", protectController, historialController.getHistorialById);
  app.put("/api/historial/:id", protectController, historialController.updateHistorial);
  app.delete("/api/historial/:id", protectController, historialController.deleteHistorial);
};
