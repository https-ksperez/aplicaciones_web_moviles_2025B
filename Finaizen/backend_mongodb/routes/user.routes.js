const UserController = require("../controllers/user.controller");
const { protectController } = require("../middlewares/auth.middleware");

module.exports = function (app) {
  // Rutas públicas (sin autenticación)
  app.post("/api/register", UserController.createUser);
  app.post("/api/login", UserController.loginUser);

  // Rutas protegidas (requieren autenticación)
  app.get("/api/me", protectController, UserController.getMe);
  app.put("/api/me", protectController, UserController.updateMe);
};
