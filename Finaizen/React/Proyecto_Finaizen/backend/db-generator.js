/**
 * Script para generar db.json desde localStorage
 * Extrae los datos de finaizen_mockdb y los convierte al formato JSON Server
 */

// Estructura base para JSON Server
const dbStructure = {
  users: [],
  perfiles: [],
  ingresos: [],
  egresos: [],
  historial: [],
  presupuestos: [],
  logros: [],
  notificaciones: [],
  planesAhorro: [],
  planesDeuda: [],
  securityLogs: [],
  config: {
    securityConfig: {
      maxLoginAttempts: 5,
      loginAttemptWindow: 900000,
      sessionTimeout: 1800000,
      requireStrongPassword: true,
      require2FA: false
    },
    loginAttempts: {}
  }
};

// Datos iniciales de ejemplo (seed data)
const seedData = {
  users: [
    {
      id: 1,
      nombre: "Kevin",
      apellido: "Administrador",
      correo: "admin@finaizen.com",
      nombreUsuario: "admin",
      contraseña: "admin123",
      pais: "Ecuador",
      ciudad: "Quito",
      fechaNacimiento: "1995-05-15",
      genero: "masculino",
      rol: "admin",
      isPremium: true,
      createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
      id: 2,
      nombre: "María",
      apellido: "González",
      correo: "maria@example.com",
      nombreUsuario: "maria.gonzalez",
      contraseña: "maria123",
      pais: "Ecuador",
      ciudad: "Guayaquil",
      fechaNacimiento: "1998-03-20",
      genero: "femenino",
      rol: "user",
      isPremium: true,
      premiumSince: "2024-10-01T00:00:00.000Z",
      subscriptionType: "anual",
      subscriptionEndDate: "2026-10-01T00:00:00.000Z",
      paymentMethod: {
        type: "tarjeta",
        brand: "Visa",
        last4: "4242",
        expiry: "12/26",
        holderName: "María González"
      },
      createdAt: "2024-02-15T00:00:00.000Z"
    },
    {
      id: 3,
      nombre: "Carlos",
      apellido: "Pérez",
      correo: "carlos@example.com",
      nombreUsuario: "carlos.perez",
      contraseña: "carlos123",
      pais: "Colombia",
      ciudad: "Bogotá",
      fechaNacimiento: "1992-08-10",
      genero: "masculino",
      rol: "user",
      isPremium: false,
      createdAt: "2024-03-20T00:00:00.000Z"
    }
  ],
  perfiles: [
    {
      id: 1,
      userId: 1,
      saldoActual: 5000.0,
      moneda: "USD",
      pais: "Ecuador",
      objetivoAhorro: 10000.0,
      metaMensual: 1000.0,
      transacciones: []
    },
    {
      id: 2,
      userId: 2,
      saldoActual: 3500.0,
      moneda: "USD",
      pais: "Ecuador",
      objetivoAhorro: 15000.0,
      metaMensual: 1500.0,
      transacciones: []
    },
    {
      id: 3,
      userId: 3,
      saldoActual: 2000.0,
      moneda: "COP",
      pais: "Colombia",
      objetivoAhorro: 8000000.0,
      metaMensual: 500000.0,
      transacciones: []
    }
  ],
  ingresos: [],
  egresos: [],
  historial: [],
  presupuestos: [],
  logros: [],
  notificaciones: [],
  planesAhorro: [],
  planesDeuda: [],
  securityLogs: []
};

// Exportar estructura completa
const db = {
  ...dbStructure,
  ...seedData
};

// Para Node.js (cuando se ejecute con node)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = db;
}

// Para browser (si se carga en HTML)
if (typeof window !== 'undefined') {
  window.seedData = db;
}

export default db;
