const PresupuestoController = require("../controllers/presupuesto.controller");
const { protectController } = require("../middlewares/auth.middleware");

module.exports = function (app) {
  // Todas las rutas de presupuestos requieren autenticación
  app.get("/api/presupuestos/:perfilId", protectController, PresupuestoController.getAllPresupuestos);
  app.get("/api/presupuestos/detalle/:id", protectController, PresupuestoController.getPresupuestoById);
  app.post("/api/presupuestos", protectController, PresupuestoController.createPresupuesto);
  app.put("/api/presupuestos/:id", protectController, PresupuestoController.updatePresupuesto);
  app.delete("/api/presupuestos/:id", protectController, PresupuestoController.deletePresupuesto);
};
