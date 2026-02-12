import "dotenv/config";
import "reflect-metadata";
import app from "./app";
import { sequelize } from "./config/database";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    

    try {
      await sequelize.sync(); // ❌ remove alter in runtime
      console.log("🧩 Models synced");
    } catch (syncError) {
      console.error("⚠️ Model sync failed:", syncError);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);

    });
  } catch (dbError) {
    console.error("❌ DB connection failed. Retrying in 5s...");
    console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_NAME:", process.env.DB_NAME);

    setTimeout(startServer, 5000);
  }
};

startServer();
