const PerfilController = require("../controllers/perfil.controller");
const { protectController } = require("../middlewares/auth.middleware");

module.exports = function (app) {
  // Todas las rutas de perfiles requieren autenticación
  app.get("/api/perfiles", protectController, PerfilController.getAllPerfiles);
  app.get("/api/perfiles/:id", protectController, PerfilController.getPerfilById);
  app.post("/api/perfiles", protectController, PerfilController.createPerfil);
  app.put("/api/perfiles/:id", protectController, PerfilController.updatePerfil);
  app.delete("/api/perfiles/:id", protectController, PerfilController.deletePerfil);
};
