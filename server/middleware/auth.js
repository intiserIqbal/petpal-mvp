// server/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes with JWT authentication
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }

  try {
    // Verify JWT and attach user to request
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-passwordHash");

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(401).json({ success: false, message: "Token invalid" });
  }
};

// ✅ Export as named export (ESM)
export { protect };
