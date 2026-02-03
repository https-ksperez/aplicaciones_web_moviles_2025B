require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Necesario para conectar frontend/móvil

const app = express();
const puerto = process.env.PORT || 8001;

// Conexión a MongoDB
require("./config/mongoose.config");

// Middlewares globales
app.use(cors()); // Habilitar CORS para la app móvil
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
require("./routes/user.routes")(app);
require("./routes/perfil.routes")(app);
require("./routes/ingreso.routes")(app);
require("./routes/egreso.routes")(app);
require("./routes/presupuesto.routes")(app);
require("./routes/planAhorro.routes")(app);
require("./routes/planDeuda.routes")(app);
require("./routes/historial.routes")(app);
require("./routes/logro.routes")(app);
require("./routes/notificacion.routes")(app);

// Ruta de prueba/health check
app.get("/", (req, res) => {
  res.json({ 
    mensaje: "🚀 Finaizen API MongoDB funcionando correctamente",
    version: "1.0.0",
    endpoints: {
      auth: "/api/register, /api/login",
      perfiles: "/api/perfiles",
      ingresos: "/api/ingresos",
      egresos: "/api/egresos",
      presupuestos: "/api/presupuestos",
      planesAhorro: "/api/planes-ahorro",
      planesDeuda: "/api/planes-deuda"
    }
  });
});

// Middleware de errores - SIEMPRE al final
const { errorHandler } = require("./middlewares/errorHandler");
app.use(errorHandler);

app.listen(puerto, () => {
  console.log(`\n🚀 Servidor Finaizen MongoDB escuchando en puerto ${puerto}`);
  console.log(`📍 URL: http://localhost:${puerto}`);
  console.log(`🔗 Health check: http://localhost:${puerto}/\n`);
});
