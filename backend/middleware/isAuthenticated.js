
import { User } from "../models/userModel.js";
import jwt from 'jsonwebtoken'

export const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        console.log("AUTH HEADER:", authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log("❌ Bearer missing");
            return res.status(400).json({
                success: false,
                message: "Authorization token is missing or invalid"
            });
        }

        const token = authHeader.split(" ")[1];
        console.log("TOKEN RECEIVED:", token); // ⭐ ADD THIS

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);

            console.log("DECODED:", decoded);

            // ✅ ADD CHECK HERE
            if (!decoded || !decoded.id) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid token payload"
                });
            }

            console.log("DECODED ID:", decoded.id);
        } catch (error) {
            console.log("JWT ERROR:", error.message);
            if (error.name === "TokenExpiredError") {
                return res.status(400).json({
                    success: false,
                    message: "The registration token has expired"
                })
            }

            return res.status(400).json({
                success: false,
                message: "Access toeken is missing or invalid "
            })
        }
        console.log("FINDING USER WITH ID:", decoded.id.toString());
        const user = await User.findById(decoded.id.toString());
        console.log("USER FROM DB:", user);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        req.user = user
        req.id = user._id
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        return res.status(403).json({
            message: "Access denied: admins only"
        })
    }
}