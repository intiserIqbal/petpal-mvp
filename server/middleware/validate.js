// server/middleware/validate.js
// Generic Zod validation middleware supporting `body` or `query`.
// Works with both CommonJS `require()` and ESM `import { validate }`.

const validate = (schema, type = "body") => (req, res, next) => {
  try {
    const data = req[type];

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.issues.map((i) => i.message),
      });
    }

    // Replace body/query with parsed (sanitized) data
    req[type] = parsed.data;
    next();
  } catch (err) {
    console.error("Validation middleware error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Export for ESM and CommonJS compatibility
export { validate };
module.exports = validate;

