const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const generateAccessToken = require("../utils/generateAccessToken");
const userModel = require("../model/user_model");

const accessCookieOptions = {
  httpOnly: true,
  sameSite: process.env.COOKIE_SAME_SITE || "lax",
  secure: process.env.COOKIE_SECURE === "true",
  maxAge: 15 * 60 * 1000,
};

module.exports = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  try {
    if (accessToken) {
      req.user = jwt.verify(accessToken, jwtConfig.access_secret);
      return next();
    }
  } catch (error) {
    if (error.name !== "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid access token" });
    }
  }

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, jwtConfig.refresh_secret);
    const user = await userModel.findById(decoded.id);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "User no longer exists" });

    const newAccessToken = generateAccessToken(user);
    res.cookie("accessToken", newAccessToken, accessCookieOptions);
    req.user = jwt.verify(newAccessToken, jwtConfig.access_secret);
    return next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired refresh token" });
  }
};
