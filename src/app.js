const express = require("express");
const cookieParser = require("cookie-parser");
//const session = require('express-session');
const app = express();

const routes = require("./routes");
const {
  notFound,
  globalErrorHandler,
} = require("./core/middleware/errorMiddleware");

// Middleware
app.use(express.json());
app.use(cookieParser());

//----------Session-based------------//
// app.use(session({
//     secret: "fre kidane",
//     saveUninitialized: false,
//     resave: false,
//     cookie: {
//       maxAge: 60000 * 60,
//       },
//    })
// );

// Routes
app.use("/api/v1", routes);

// Not Found
app.use(notFound);

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
