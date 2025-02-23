import jwt from "jsonwebtoken";

const adminMiddleware = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decoded.role && decoded.role.toLowerCase() === "admin") {
      req.user = decoded;
      next();
    } else {
      return res.status(403).json({
        error: "Forbidden. Admin access required.",
      });
    }
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized. Invalid token." });
  }
};

export { adminMiddleware };
