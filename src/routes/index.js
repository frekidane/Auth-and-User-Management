const router = require("express").Router();
const userRoutes = require("../user/routes/userRoutes");

// routes
router.use("/users", userRoutes);

module.exports = router;
