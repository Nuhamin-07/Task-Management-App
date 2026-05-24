import bcrypt from "bcrypt";
import validator from "validator";

import {
  insertUser,
  getUserByEmail,
  getCurrentUserById,
} from "../sql/handleData.js";

export async function registerUser(req, res) {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    const cleanEmail = email?.trim().toLowerCase();

    const user = await getUserByEmail(cleanEmail);

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await insertUser(
      first_name,
      last_name,
      cleanEmail,
      hashedPassword,
    );

    req.session.userId = newUser.lastID;

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.lastID,
        name: first_name + " " + last_name,
        email: email,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const cleanEmail = email?.trim().toLowerCase();
    const user = await getUserByEmail(cleanEmail);

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.userId = user.id;
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user.id,
        name: user.first_name + " " + user.last_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export function logoutUser(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out user:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json({ message: "User logged out successfully" });
  });
}

export function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export async function getCurrentUser(req, res) {
  try {
    const user = await getCurrentUserById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
