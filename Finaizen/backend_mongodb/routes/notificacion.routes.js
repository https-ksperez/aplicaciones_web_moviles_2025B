const notificacionController = require("../controllers/notificacion.controller");
const { protectController } = require("../middlewares/auth.middleware");

module.exports = function (app) {
  // Todas las rutas de notificaciones requieren autenticación
  app.get("/api/notificaciones", protectController, notificacionController.getAllNotificaciones);
  app.get("/api/notificaciones/no-leidas/count", protectController, notificacionController.getConteoNoLeidas);
  app.get("/api/notificaciones/:id", protectController, notificacionController.getNotificacionById);
  app.post("/api/notificaciones", protectController, notificacionController.createNotificacion);
  app.put("/api/notificaciones/:id/leer", protectController, notificacionController.marcarLeida);
  app.put("/api/notificaciones/leer-todas", protectController, notificacionController.marcarTodasLeidas);
  app.delete("/api/notificaciones/leidas", protectController, notificacionController.deleteLeidas);
  app.delete("/api/notificaciones/:id", protectController, notificacionController.deleteNotificacion);
};
