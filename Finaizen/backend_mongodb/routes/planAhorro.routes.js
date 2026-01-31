const PlanAhorroController = require("../controllers/planAhorro.controller");
const { protectController } = require("../middlewares/auth.middleware");

module.exports = function (app) {
  // Todas las rutas de planes de ahorro requieren autenticación
  app.get("/api/planes-ahorro/:perfilId", protectController, PlanAhorroController.getAllPlanesAhorro);
  app.get("/api/planes-ahorro/detalle/:id", protectController, PlanAhorroController.getPlanAhorroById);
  app.post("/api/planes-ahorro", protectController, PlanAhorroController.createPlanAhorro);
  app.put("/api/planes-ahorro/:id", protectController, PlanAhorroController.updatePlanAhorro);
  app.put("/api/planes-ahorro/:id/depositar", protectController, PlanAhorroController.depositarPlanAhorro);
  app.delete("/api/planes-ahorro/:id", protectController, PlanAhorroController.deletePlanAhorro);
};
