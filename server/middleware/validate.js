// server/middleware/validate.js
import { ZodError } from "zod";

export default (schema, type = "body") => (req, res, next) => {
  try {
    const data = req[type];
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.issues.map((i) => i.message),
      });
    }

    // ✅ Fix: mutate instead of overwrite
    if (type === "query") {
      Object.assign(req.query, parsed.data);
    } else {
      req.body = parsed.data;
    }

    next();
  } catch (err) {
    console.error("Validation middleware error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
