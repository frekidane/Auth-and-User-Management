// controllers/userController.js
const User = require("../model/usermodel");
const catchAsync = require("../../core/utils/catchAsync");
const AppError = require("../../core/utils/appError");

// Create new user (Admin only)
exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return next(
      new AppError("Please provide username, email, and password", 400)
    );
  }

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm: password,
    role,
  });

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

// Get all users (admin only)
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

// Get user by ID
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// Update user info (not password)
exports.updateUser = catchAsync(async (req, res, next) => {
  const { name, email, role } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// Delete user
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "User deleted!!!!!",
  });
});
