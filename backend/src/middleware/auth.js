import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function auth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace(
      "Bearer ",
      ""
    );

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(payload.id);

    if (!user) {
      return res.status(401).json({
        message: "Account not found",
      });
    }

    /* =========================
       ACCOUNT STATUS
    ========================= */

    if (
      user.role !== "ADMIN" &&
      user.status !== "ACTIVE"
    ) {
      if (user.status === "SUSPENDED") {
        return res.status(403).json({
          message: "Account is not active now",
          status: "SUSPENDED",
        });
      }

      if (user.status === "DELETED") {
        return res.status(403).json({
          message: "Account is not active now",
          status: "DELETED",
        });
      }

      return res.status(403).json({
        message: "Account is not active now",
        status: user.status,
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}


/* =========================
   ADMIN ONLY
========================= */

export function adminOnly(req, res, next) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
}