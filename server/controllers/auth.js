import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// POST /auth/register
const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const db = req.app.locals.db;
    // Check if the user already exists
    const existingUser = await db.get(
      "SELECT * FROM users WHERE email = ?",
      email
    );
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert new user with default role 'admin'
    const result = await db.run(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      email,
      hashedPassword,
      "admin"
    );
    const newUser = {
      id: result.lastID,
      email,
      password: hashedPassword,
      role: "admin",
    };

    // Generate tokens
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // Set tokens in HTTP-only cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    next(err);
  }
};

// POST /auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const db = req.app.locals.db;
    // Find user by email from the database
    const user = await db.get("SELECT * FROM users WHERE email = ?", email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set tokens in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res.json({ message: "Logged in successfully" });
  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};

// GET /auth - Check authentication status
const auth = async (req, res, next) => {
  try {
    // Extract token from cookies or Authorization header
    const token =
      (req.cookies && req.cookies.accessToken) ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (!token) {
      return res
        .status(401)
        .json({ authenticated: false, message: "No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (error) {
      return res
        .status(403)
        .json({ authenticated: false, message: "Invalid token" });
    }

    const db = req.app.locals.db;
    const user = await db.get("SELECT * FROM users WHERE id = ?", decoded.id);
    if (!user) {
      return res
        .status(404)
        .json({ authenticated: false, message: "User not found" });
    }
    const userInfo = { id: user.id, email: user.email, role: user.role };
    return res.json({ authenticated: true, user: userInfo });
  } catch (err) {
    console.error("Auth check error:", err);
    next(err);
  }
};

// POST /auth/logout
const logout = (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    next(err);
  }
};

// POST /token - Refresh access token
const token = async (req, res, next) => {
  try {
    // Get refresh token from cookies
    const refreshToken = req.cookies && req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (error) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const db = req.app.locals.db;
    const user = await db.get("SELECT * FROM users WHERE id = ?", decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newAccessToken = generateAccessToken(user);
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return res.json({ message: "Access token refreshed" });
  } catch (err) {
    console.error("Token refresh error:", err);
    next(err);
  }
};

export { register, login, auth, logout, token };
