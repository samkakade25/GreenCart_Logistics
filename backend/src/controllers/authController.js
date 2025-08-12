import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; 

// Register manager (for initial setup)
export const registerManager = async (req, res) => {
  // Validate inputs here if needed

  try {
    const { username, password } = req.body;

    const existing = await prisma.manager.findUnique({ where: { username } });
    if (existing) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const manager = await prisma.manager.create({
      data: { username, password: hashedPassword },
    });

    res.status(201).json({ message: "Manager registered", id: manager.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Login manager
export const loginManager = async (req, res) => {
  // Validate inputs here if needed
  try {
    const { username, password } = req.body;

    const manager = await prisma.manager.findUnique({ where: { username } });
    if (!manager) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, manager.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: manager.id, username: manager.username }, JWT_SECRET, {
      expiresIn: "8h",
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Middleware to verify JWT token
export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Authorization header missing" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    req.user = user;
    next();
  });
};
