const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

// PUBLIC AUTH ROUTES
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// refresh access token
router.get("/refresh-token", authController.refreshToken);
router.post("/forgotPassword", protect, authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch("/updateMyPassword", protect, authController.updatePassword);

// USER ROUTES (PROTECTED)
router.use(protect);
router.use(restrictTo("admin"));

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
