const IngresoController = require("../controllers/ingreso.controller");
const { protectController } = require("../middlewares/auth.middleware");

module.exports = function (app) {
  // Todas las rutas de ingresos requieren autenticación
  app.get("/api/ingresos/:perfilId", protectController, IngresoController.getAllIngresos);
  app.get("/api/ingresos/detalle/:id", protectController, IngresoController.getIngresoById);
  app.post("/api/ingresos", protectController, IngresoController.createIngreso);
  app.put("/api/ingresos/:id", protectController, IngresoController.updateIngreso);
  app.delete("/api/ingresos/:id", protectController, IngresoController.deleteIngreso);
};
