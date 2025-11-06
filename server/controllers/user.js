import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Name,Email and Password are required!",
      });
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        msg: "User Already Exists.Please Login!",
      });
    }

    const user = await User.create({ name, email, password });
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res
      .status(201)
      .cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({
        success: true,
        msg: `Registered Successfully. Welcome ${user.name}!`,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message || "Internal Server Error!",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Email and Password are required!",
      });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Invalid Email or Password!",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        msg: "Invalid Email or Password!",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res
      .status(200)
      .cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({
        success: true,
        msg: `Welcome back ${user.name}!`,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message || "Internal Server Error!",
    });
  }
};

export const getUser = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = (req, res) => {
  return res
    .status(200)
    .cookie("token", "", {
      maxAge: 0,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      msg: "You logged out!",
    });
};
