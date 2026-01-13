import express from 'express';
import cors from 'cors';
import itemsRoutes from './routes/items.js';

// Crear aplicación Express
const app = express();

// Configurar puerto (variable de entorno o puerto 3000 por defecto)
const PORT = process.env.PORT || 3000;

// Middleware: CORS - Permitir peticiones desde el frontend
app.use(cors({
  origin: 'http://localhost:5173', // Puerto de Vite (frontend)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware: Procesar JSON en el cuerpo de las solicitudes
app.use(express.json());

// Middleware: Procesar datos URL-encoded (formularios)
app.use(express.urlencoded({ extended: true }));

// Middleware de logging personalizado
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

/**
 * RUTAS DE LA API
 */

// Ruta raíz - Información de la API
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenido a Finaizen API REST',
    version: '1.0.0',
    endpoints: {
      items: {
        getAll: 'GET /items',
        getById: 'GET /items/:id',
        create: 'POST /items',
        update: 'PUT /items/:id',
        delete: 'DELETE /items/:id'
      }
    },
    documentation: 'Ver README.md para más información'
  });
});

// Rutas de items
app.use('/items', itemsRoutes);

/**
 * MANEJO DE ERRORES
 */

// Ruta no encontrada - 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.path} no encontrada`,
    availableEndpoints: ['/items']
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Ocurrió un error'
  });
});

/**
 * INICIAR SERVIDOR
 */
app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('Servidor Express iniciado');
  console.log(`Puerto: ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`API Docs: http://localhost:${PORT}`);
  console.log('========================================\n');
});

export default app;
