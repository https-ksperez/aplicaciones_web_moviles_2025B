require('dotenv').config();

module.exports = {
  // Server
  PORT: process.env.PORT || 5000,
  HOST: process.env.HOST || 'localhost',
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: process.env.DB_PORT || 5432,
    NAME: process.env.DB_NAME || 'finaizen_db',
    USER: process.env.DB_USER || 'postgres',
    PASSWORD: process.env.DB_PASSWORD || 'postgres',
    DIALECT: process.env.DB_DIALECT || 'postgres'
  },

  // JWT
  JWT: {
    SECRET: process.env.JWT_SECRET || 'default_secret_key_change_in_production',
    EXPIRE: process.env.JWT_EXPIRE || '7d',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
    REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '30d'
  },

  // CORS
  CORS: {
    ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173'
  },

  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutos
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },

  // Email (opcional)
  EMAIL: {
    HOST: process.env.EMAIL_HOST,
    PORT: process.env.EMAIL_PORT,
    USER: process.env.EMAIL_USER,
    PASSWORD: process.env.EMAIL_PASSWORD,
    FROM: process.env.EMAIL_FROM
  },

  // File Upload
  UPLOAD: {
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
    PATH: process.env.UPLOAD_PATH || './uploads'
  }
};
