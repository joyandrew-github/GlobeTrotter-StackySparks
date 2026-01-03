const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1️⃣ Token NOT provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Token not provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2️⃣ Token verification (also checks expiry)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // token is valid & not expired
    req.user = decoded; // { userId, email, iat, exp }
    next();
  } catch (error) {
    // 3️⃣ Token expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again",
      });
    }

    // 4️⃣ Token invalid
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = authMiddleware;
