const User = require("../model/usermodel");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("../../core/utils/catchAsync");
const AppError = require("../../core/utils/appError");

// Protect routes: check if user is logged in
exports.protect = catchAsync(async (req, res, next) => {
  // Get token from headers
  let token;

    // 1) Check for access token in httpOnly cookie
  if (req.cookies && req.cookies.access_token) {
    token = req.cookies.access_token;
  }
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  //console.log("Token received:", token);


  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //console.log(decoded);
  // Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }

  // Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // Grant access
  req.user = currentUser;
  next();
});

// Restrict routes to specific roles (admin, user, etc.)
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
     if (!req.user) return next(new AppError("No user information available", 500));
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
