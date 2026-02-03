/**
 * Script principal de Seeds para MongoDB
 * Ejecutar con: npm run seed
 *
 * Este script pobla la base de datos con datos de demostración
 * equivalentes a los seeders de PostgreSQL
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
const RegistroHistorial = require("../models/registroHistorial.model");
const Logro = require("../models/logro.model");
const Notificacion = require("../models/notificacion.model");

// Seeders
const { getUsersSeedData } = require("./users.seed");
const { getPerfilesSeedData } = require("./perfiles.seed");
const { getIngresosSeedData } = require("./ingresos.seed");
const { getEgresosSeedData } = require("./egresos.seed");
const { getPresupuestosSeedData } = require("./presupuestos.seed");
const { getPlanesAhorroSeedData } = require("./planesAhorro.seed");
const { getPlanesDeudaSeedData } = require("./planesDeuda.seed");
const { getHistorialSeedData } = require("./historial.seed");
const { getLogrosSeedData } = require("./logros.seed");
const { getNotificacionesSeedData } = require("./notificaciones.seed");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/finaizen_db";

const seedDatabase = async () => {
  try {
    // Conectar a MongoDB
    console.log("🔗 Conectando a MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log(`✅ Conectado a: ${mongoose.connection.name}\n`);

    // Limpiar base de datos existente
    console.log("🗑️  Limpiando base de datos...");
    await Promise.all([
      User.deleteMany({}),
      Perfil.deleteMany({}),
      Ingreso.deleteMany({}),
      Egreso.deleteMany({}),
      Presupuesto.deleteMany({}),
      PlanAhorro.deleteMany({}),
      PlanDeuda.deleteMany({}),
      RegistroHistorial.deleteMany({}),
      Logro.deleteMany({}),
      Notificacion.deleteMany({}),
    ]);
    console.log("✅ Base de datos limpia\n");

    // 1. Crear Usuarios
    console.log("👤 Creando usuarios...");
    const usersData = await getUsersSeedData();
    const createdUsers = await User.insertMany(usersData);
    console.log(`   ✅ ${createdUsers.length} usuarios creados`);

    // Mapear IDs de usuarios
    const userIds = {
      admin: createdUsers.find((u) => u.correo === "admin@finaizen.com")._id,
      maria: createdUsers.find((u) => u.correo === "maria@example.com")._id,
      carlos: createdUsers.find((u) => u.correo === "carlos@example.com")._id,
    };

    // 2. Crear Perfiles
    console.log("📋 Creando perfiles...");
    const perfilesData = getPerfilesSeedData(userIds);
    const createdPerfiles = await Perfil.insertMany(perfilesData);
    console.log(`   ✅ ${createdPerfiles.length} perfiles creados`);

    // Mapear IDs de perfiles
    const perfilIds = {
      adminPerfil: createdPerfiles.find(
        (p) => p.userId.toString() === userIds.admin.toString() && p.nombre === "Admin"
      )._id,
      mariaPersonal: createdPerfiles.find(
        (p) => p.userId.toString() === userIds.maria.toString() && p.nombre === "Personal"
      )._id,
      mariaNegocio: createdPerfiles.find(
        (p) => p.userId.toString() === userIds.maria.toString() && p.nombre === "Negocio"
      )._id,
      carlosPersonal: createdPerfiles.find(
        (p) => p.userId.toString() === userIds.carlos.toString() && p.nombre === "Personal"
      )._id,
    };

    // 3. Crear Ingresos
    console.log("💰 Creando ingresos...");
    const ingresosData = getIngresosSeedData(perfilIds);
    const createdIngresos = await Ingreso.insertMany(ingresosData);
    console.log(`   ✅ ${createdIngresos.length} ingresos creados`);

    // 4. Crear Egresos
    console.log("💸 Creando egresos...");
    const egresosData = getEgresosSeedData(perfilIds);
    const createdEgresos = await Egreso.insertMany(egresosData);
    console.log(`   ✅ ${createdEgresos.length} egresos creados`);

    // 5. Crear Presupuestos
    console.log("📊 Creando presupuestos...");
    const presupuestosData = getPresupuestosSeedData(perfilIds);
    const createdPresupuestos = await Presupuesto.insertMany(presupuestosData);
    console.log(`   ✅ ${createdPresupuestos.length} presupuestos creados`);

    // 6. Crear Planes de Ahorro
    console.log("🎯 Creando planes de ahorro...");
    const planesAhorroData = getPlanesAhorroSeedData(perfilIds);
    const createdPlanesAhorro = await PlanAhorro.insertMany(planesAhorroData);
    console.log(`   ✅ ${createdPlanesAhorro.length} planes de ahorro creados`);

    // 7. Crear Planes de Deuda
    console.log("💳 Creando planes de deuda...");
    const planesDeudaData = getPlanesDeudaSeedData(perfilIds);
    const createdPlanesDeuda = await PlanDeuda.insertMany(planesDeudaData);
    console.log(`   ✅ ${createdPlanesDeuda.length} planes de deuda creados`);

    // 8. Crear Historial
    console.log("📜 Creando historial...");
    const historialData = getHistorialSeedData(perfilIds);
    const createdHistorial = await RegistroHistorial.insertMany(historialData);
    console.log(`   ✅ ${createdHistorial.length} registros de historial creados`);

    // 9. Crear Logros
    console.log("🏆 Creando logros...");
    const logrosData = getLogrosSeedData(perfilIds);
    const createdLogros = await Logro.insertMany(logrosData);
    console.log(`   ✅ ${createdLogros.length} logros creados`);

    // 10. Crear Notificaciones
    console.log("🔔 Creando notificaciones...");
    const notificacionesData = getNotificacionesSeedData(userIds, perfilIds);
    const createdNotificaciones = await Notificacion.insertMany(notificacionesData);
    console.log(`   ✅ ${createdNotificaciones.length} notificaciones creadas`);

    // Resumen final
    console.log("\n" + "=".repeat(50));
    console.log("🎉 ¡Seeds completados exitosamente!");
    console.log("=".repeat(50));
    console.log("\n📊 Resumen de datos creados:");
    console.log(`   👤 Usuarios:         ${createdUsers.length}`);
    console.log(`   📋 Perfiles:         ${createdPerfiles.length}`);
    console.log(`   💰 Ingresos:         ${createdIngresos.length}`);
    console.log(`   💸 Egresos:          ${createdEgresos.length}`);
    console.log(`   📊 Presupuestos:     ${createdPresupuestos.length}`);
    console.log(`   🎯 Planes Ahorro:    ${createdPlanesAhorro.length}`);
    console.log(`   💳 Planes Deuda:     ${createdPlanesDeuda.length}`);
    console.log(`   📜 Historial:        ${createdHistorial.length}`);
    console.log(`   🏆 Logros:           ${createdLogros.length}`);
    console.log(`   🔔 Notificaciones:   ${createdNotificaciones.length}`);

    console.log("\n🔑 Credenciales de prueba:");
    console.log("   ┌────────────────────────────────────────────┐");
    console.log("   │ Admin:  admin@finaizen.com / admin123     │");
    console.log("   │ María:  maria@example.com / maria123      │");
    console.log("   │ Carlos: carlos@example.com / carlos123    │");
    console.log("   └────────────────────────────────────────────┘");

    console.log("\n✅ Puedes iniciar el servidor con: npm run dev\n");

  } catch (error) {
    console.error("\n❌ Error ejecutando seeds:", error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Conexión a MongoDB cerrada");
    process.exit(0);
  }
};

// Ejecutar seeds
seedDatabase();
