module.exports = {
    access_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    refresh_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    expiresIn_refresh: "7d",
    expiresIn_access: "15m"
};