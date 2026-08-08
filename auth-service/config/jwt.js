module.exports = {
    access_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    refresh_secret: process.env.JWT_REFERESH_TOKEN_SECRET,
    ecpiresIn_refresh: "7d",
    expiresIn_access: "15m"
};