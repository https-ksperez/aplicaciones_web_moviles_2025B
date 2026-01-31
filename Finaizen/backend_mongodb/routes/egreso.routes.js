const EgresoController = require("../controllers/egreso.controller");
const { protectController } = require("../middlewares/auth.middleware");

module.exports = function (app) {
  // Todas las rutas de egresos requieren autenticación
  app.get("/api/egresos/:perfilId", protectController, EgresoController.getAllEgresos);
  app.get("/api/egresos/detalle/:id", protectController, EgresoController.getEgresoById);
  app.post("/api/egresos", protectController, EgresoController.createEgreso);
  app.put("/api/egresos/:id", protectController, EgresoController.updateEgreso);
  app.delete("/api/egresos/:id", protectController, EgresoController.deleteEgreso);
};
