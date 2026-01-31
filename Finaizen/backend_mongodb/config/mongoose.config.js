const mongoose = require("mongoose");

const bdd_uri = process.env.MONGODB_URI || "mongodb://localhost/finaizen_db";

const conectarBDD = async () => {
  try {
    await mongoose.connect(bdd_uri);
    console.log(`✅ Conexión a MongoDB exitosa`);
    console.log(`📦 Base de datos: ${mongoose.connection.name}`);
  } catch (err) {
    console.log("❌ Falló la conexión a MongoDB: " + err);
    process.exit(1);
  }
};

// Eventos de conexión
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB desconectado");
});

mongoose.connection.on("error", (err) => {
  console.log("❌ Error en MongoDB: " + err);
});

conectarBDD();
