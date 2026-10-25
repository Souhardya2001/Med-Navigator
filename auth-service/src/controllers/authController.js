const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../model/user_model");
const jwtConfig = require("../config/jwt");
const generateAccessToken = require("../utils/generateAccessToken");
const generateRefreshToken = require("../utils/generateRefreshToken");

const cookieBaseOptions = {
  httpOnly: true,
  sameSite: process.env.COOKIE_SAME_SITE || "lax",
  secure: process.env.COOKIE_SECURE === "true",
};
const publicUser = (user) => ({
  id: String(user._id),
  username: user.username,
  email: user.email,
  name: user.name,
  age: user.age,
  role: user.role,
});

exports.signup = async (req, res, next) => {
  try {
    const { email, password, name, age, username } = req.body;
    if (!email || !password || !name || !username) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email, password, name, and username are required",
        });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await userModel.create({
      username,
      email,
      password: passwordHash,
      name,
      age,
    });
    return res
      .status(201)
      .json({
        success: true,
        message: "User created successfully. Please log in.",
        user: publicUser(user),
      });
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    const user = await userModel.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.lastLogin = new Date();
    await user.save();
    res.cookie("accessToken", accessToken, {
      ...cookieBaseOptions,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieBaseOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      success: true,
      message: "User logged in successfully",
      user: publicUser(user),
      accessToken,
    });
  } catch (error) {
    return next(error);
  }
};

exports.refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res
      .status(401)
      .json({ success: false, message: "Refresh token is required" });
  try {
    const decoded = jwt.verify(refreshToken, jwtConfig.refresh_secret);
    const user = await userModel.findById(decoded.id);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "User no longer exists" });
    const accessToken = generateAccessToken(user);
    res.cookie("accessToken", accessToken, {
      ...cookieBaseOptions,
      maxAge: 15 * 60 * 1000,
    });
    return res.json({ success: true, accessToken, user: publicUser(user) });
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired refresh token" });
  }
};

exports.logout = (_req, res) => {
  res.clearCookie("accessToken", cookieBaseOptions);
  res.clearCookie("refreshToken", cookieBaseOptions);
  return res.json({ success: true, message: "Logged out successfully" });
};

exports.profile = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    return res.json({ success: true, user });
  } catch (error) {
    return next(error);
  }
};
