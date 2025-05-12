import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { db } from "../db/index.js";
import { UserRole } from "../generated/prisma/index.js";

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, Email and Password are required.",
    });
  }

  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole.USER,
      },
    });

    return res.status(201).json({
      success: true,
      message: "User registred successfully.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        image: newUser.image,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error. User registration failed.",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials.",
      });
    }

    const token = await jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_TOKEN_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.status(200).json({
      success: true,
      message: "User authenticated successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    return res.staus(500).json({
      success: false,
      message: "Internal server error. User authentication failed.",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    return res.status(204).json({
      success: true,
      message: "User logged out successfully.",
    });
  } catch (error) {
    return res.staus(500).json({
      success: false,
      message: "Internal server error. User logout failed.",
    });
  }
};

const me = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error. Current user data fetch failed.",
    });
  }
};

export { registerUser, loginUser, logoutUser, me };
