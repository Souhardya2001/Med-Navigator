const jwt = require('jsonwebtoken');

const generarteRefreshToken = (user) =>{
    return jwt.sign(
        {id: user._id},
        jwtConfig.refresh_token_secret,
        {
            expiresIn: jwtConfig.expiresIn_refersh
        }
    )
}