/**
 * Script para limpiar la base de datos MongoDB
 * Ejecutar con: npm run db:clean
 */
require("dotenv").config();
const mongoose = require("mongoose");

// Modelos
const User = require("../models/user.model");
const Perfil = require("../models/perfil.model");
const Ingreso = require("../models/ingreso.model");
const Egreso = require("../models/egreso.model");
const Presupuesto = require("../models/presupuesto.model");
const PlanAhorro = require("../models/planAhorro.model");
const PlanDeuda = require("../models/planDeuda.model");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/finaizen_db";

const cleanDatabase = async () => {
  try {
    console.log("🔗 Conectando a MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log(`✅ Conectado a: ${mongoose.connection.name}\n`);

    console.log("🗑️  Limpiando base de datos...");
    
    const results = await Promise.all([
      User.deleteMany({}),
      Perfil.deleteMany({}),
      Ingreso.deleteMany({}),
      Egreso.deleteMany({}),
      Presupuesto.deleteMany({}),
      PlanAhorro.deleteMany({}),
      PlanDeuda.deleteMany({}),
    ]);

    console.log("\n📊 Registros eliminados:");
    console.log(`   👤 Usuarios:         ${results[0].deletedCount}`);
    console.log(`   📋 Perfiles:         ${results[1].deletedCount}`);
    console.log(`   💰 Ingresos:         ${results[2].deletedCount}`);
    console.log(`   💸 Egresos:          ${results[3].deletedCount}`);
    console.log(`   📊 Presupuestos:     ${results[4].deletedCount}`);
    console.log(`   🎯 Planes Ahorro:    ${results[5].deletedCount}`);
    console.log(`   💳 Planes Deuda:     ${results[6].deletedCount}`);

    console.log("\n✅ Base de datos limpia");

  } catch (error) {
    console.error("\n❌ Error limpiando base de datos:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Conexión a MongoDB cerrada");
    process.exit(0);
  }
};

cleanDatabase();
