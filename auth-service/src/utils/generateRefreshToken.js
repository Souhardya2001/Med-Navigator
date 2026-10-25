const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt')
const generateRefreshToken = (user) =>{
    return jwt.sign(
        {id: user._id},
        jwtConfig.refresh_secret,
        {
            expiresIn: jwtConfig.expiresIn_refresh
        }
    )
}
module.exports = generateRefreshToken;