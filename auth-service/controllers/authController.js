const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../model/user_model");
const generateAccessToken = require("../utils/generateAccessToken");

// Signup Controller
exports.signup = async (req, res) => {
    try {

        const { email, password, name, age, username } = req.body;

        bcrypt.genSalt(10, (err, salt) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error generating salt"
                });
            }

            bcrypt.hash(password, salt, async (err, hash) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Error hashing password"
                    });
                }

                const createdUser = await userModel.create({
                    username,
                    email,
                    password: hash,
                    name,
                    age
                });

                res.status(201).json({
                    success: true,
                    message: "User created successfully",
                    user: createdUser
                });

            });

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

// Login Controller

exports.login = async (req, res) => {

    try {

        const { email, password, username } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        bcrypt.compare(password, user.password, (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error comparing password"
                });
            }

            if (!result) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }
            // Getting accessToken and refreshToken

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
        
            // Setting cookies for accessToken and refreshToken

            res.cookie("accessToken", accessToken,
                {
                    httpOnly:true,
                    sameSite: "lax",
                    maxAge: 15 * 60 * 1000

                 }
        );
        
        res.cookie("refershToken", refershToken,
            {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000
            }
        );

            res.status(200).json({
                success: true,
                message: "User logged in successfully"
            });

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// Logout Controller

exports.logout = (req, res) => {

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });

};