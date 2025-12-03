require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const app = require("./src/app");

const PORT = process.env.PORT || 8000;
const DB = process.env.ATLAS_DATABASE;
//const DB = process.env.LOCAL_DATABASE;

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

if (!DB) {
  console.error(
    "No MongoDB URI found. Set ATLAS_DATABASE or LOCAL_DATABASE in .env"
  );
  process.exit(1);
}

let server;

(async () => {
  try {
    //console.log(DB);
    await mongoose.connect(DB);
    console.log("Connected to MongoDB");

    server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
})();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION Shutting down...");
  console.error(err.name, err.message);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Handle SIGTERM (graceful shutdown in production)
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      console.log("Process terminated!");
    });
  }
});
