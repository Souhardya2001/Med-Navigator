const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const generateAccessToken = require("../utils/generateAccessToken");
const userModel = require("../model/user_model");

const isLoggedIn = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    //No tokens found
    if (!accessToken && !refreshToken) {
      // return res.redirect("/login");
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // accessToken exists
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, jwtConbfig.access_token_secret);
        req.user = decoded;
        return next();
      } catch (error) {

        // If access token is invalid for reasons other than expiry
        if (error.name !== "TokenExpiredError") {
          // return logout(req,res);
        }
      }
    }

    // accessToken doesn't exist and refreshToken exists
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, jwtConfig.refresh_secret);

        const user = await userModel.findById(decoded.id);
        if(!user){
            // return logout(req,res);
        }
        const accessToken = generateAccessToken(user);
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 1 * 60 * 1000,
        });
        req.user = decoded;
        return next();
      } catch (error) {

        //   return logout(req, res);
      }
    }
    // return logout(req, res);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

module.exports = isLoggedIn;
