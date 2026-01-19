const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const config = require('./config/config');
const { sequelize } = require('./models');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const perfilRoutes = require('./routes/perfilRoutes');
const ingresoRoutes = require('./routes/ingresoRoutes');
const egresoRoutes = require('./routes/egresoRoutes');
const presupuestoRoutes = require('./routes/presupuestoRoutes');
const planAhorroRoutes = require('./routes/planAhorroRoutes');
const planDeudaRoutes = require('./routes/planDeudaRoutes');
const logroRoutes = require('./routes/logroRoutes');
const historialRoutes = require('./routes/historialRoutes');
const notificacionRoutes = require('./routes/notificacionRoutes');

// Rutas de Admin
const rolesRoutes = require('./routes/rolesRoutes');
const marketRoutes = require('./routes/marketRoutes');
const supervisionRoutes = require('./routes/supervisionRoutes');
const supportRoutes = require('./routes/supportRoutes');
const securityRoutes = require('./routes/securityRoutes');
const schedulerRoutes = require('./routes/schedulerRoutes');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - Permitir múltiples orígenes
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (como Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting - más permisivo en desarrollo
const limiter = rateLimit({
  windowMs: config.NODE_ENV === 'development' ? 60000 : config.RATE_LIMIT.WINDOW_MS, // 1 min en dev
  max: config.NODE_ENV === 'development' ? 500 : config.RATE_LIMIT.MAX_REQUESTS, // 500 en dev
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP, por favor intenta más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression middleware
app.use(compression());

// Logging middleware
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Finaizen API is running',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/perfiles', perfilRoutes);
app.use('/api/notificaciones', notificacionRoutes);

// Rutas anidadas para recursos de perfil
app.use('/api/perfiles/:perfilId/ingresos', ingresoRoutes);
app.use('/api/perfiles/:perfilId/egresos', egresoRoutes);
app.use('/api/perfiles/:perfilId/presupuestos', presupuestoRoutes);
app.use('/api/perfiles/:perfilId/planes-ahorro', planAhorroRoutes);
app.use('/api/perfiles/:perfilId/planes-deuda', planDeudaRoutes);
app.use('/api/perfiles/:perfilId/logros', logroRoutes);
app.use('/api/perfiles/:perfilId/historial', historialRoutes);

// Rutas de Admin
app.use('/api/admin/roles', rolesRoutes);
app.use('/api/admin/market', marketRoutes);
app.use('/api/admin/supervision', supervisionRoutes);
app.use('/api/admin/support', supportRoutes);
app.use('/api/admin/security', securityRoutes);

// Ruta del Scheduler (tareas programadas)
app.use('/api/scheduler', schedulerRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenido a Finaizen API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// Error handlers (deben ir al final)
app.use(notFound);
app.use(errorHandler);

// Database connection and server start
const PORT = config.PORT || 5000;

// Importar servicio de tareas programadas
const { iniciarScheduler } = require('./services/schedulerService');

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida exitosamente.');

    // Sync database (solo en desarrollo - usar migraciones en producción)
    if (config.NODE_ENV === 'development') {
      // await sequelize.sync({ alter: true });
      console.log('📊 Base de datos sincronizada.');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://${config.HOST}:${PORT}`);
      console.log(`📝 Entorno: ${config.NODE_ENV}`);
      console.log(`🔐 JWT configurado correctamente`);
      
      // Iniciar el scheduler de transacciones automáticas
      iniciarScheduler();
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recibido. Cerrando servidor gracefully...');
  process.exit(0);
});

startServer();

module.exports = app;
