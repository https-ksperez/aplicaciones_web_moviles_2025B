const logroController = require("../controllers/logro.controller");
const { protectController } = require("../middlewares/auth.middleware");

module.exports = function (app) {
  // Todas las rutas de logros requieren autenticación

  // Rutas para logros por perfil
  app.get("/api/logros/:perfilId", protectController, logroController.getAllLogros);

  // Rutas para logro individual
  app.get("/api/logros/detalle/:id", protectController, logroController.getLogroById);
  app.post("/api/logros", protectController, logroController.createLogro);
  app.put("/api/logros/:id", protectController, logroController.updateLogro);
  app.put("/api/logros/:id/desbloquear", protectController, logroController.desbloquearLogro);
  app.put("/api/logros/:id/progreso", protectController, logroController.actualizarProgreso);
  app.delete("/api/logros/:id", protectController, logroController.deleteLogro);
};
