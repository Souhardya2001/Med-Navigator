const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

const generateAccessToken = (user) => {

    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role
        },
        jwtConfig.access_secret,
        {
            expiresIn: jwtConfig.expiresIn_access
        }
    );

};

module.exports = generateAccessToken;