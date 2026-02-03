const planDeudaController = require("../controllers/planDeuda.controller");
const { protectController } = require("../middlewares/auth.middleware");

module.exports = (app) => {
  // Crear un nuevo plan de deuda
  app.post("/api/planes-deuda", protectController, planDeudaController.crear);

  // Obtener planes de deuda por perfil
  app.get(
    "/api/planes-deuda/perfil/:perfilId",
    protectController,
    planDeudaController.obtenerPorPerfil
  );

  // Obtener estadísticas de deudas por perfil
  app.get(
    "/api/planes-deuda/estadisticas/:perfilId",
    protectController,
    planDeudaController.estadisticas
  );

  // Obtener un plan de deuda por ID
  app.get("/api/planes-deuda/:id", protectController, planDeudaController.obtenerPorId);

  // Actualizar un plan de deuda
  app.put("/api/planes-deuda/:id", protectController, planDeudaController.actualizar);

  // Registrar un pago
  app.post("/api/planes-deuda/:id/pago", protectController, planDeudaController.registrarPago);

  // Eliminar un plan de deuda
  app.delete("/api/planes-deuda/:id", protectController, planDeudaController.eliminar);
};
