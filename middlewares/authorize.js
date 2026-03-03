import { AppError } from "../lib/error.js";

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      // should not happen if auth middleware runs first
      throw new AppError(401, "Not authenticated");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(403, "You are not allowed to access this resource");
    }

    next(); 
  };
};
