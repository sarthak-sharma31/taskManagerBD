import jwt from "jsonwebtoken";
import {User} from '../models/User.js';

const protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                return res.status(401).json({ message: "User no longer exists" });
            }

            req.user = user;
            next();
        } else {
            return res.status(401).json({ message: "Not authorized, no token" });
        }
    } catch (error) {
        return res.status(401).json({
            message: "Token failed",
            error: error.message
        });
    }
};

const adminOnly = (req, res, next)=>{
    if(req.user && req.user.role === "admin"){
        next()
    }
    else{
        req.status(403).json({message: "Access denied, admin only"})
    }
}

export {protect, adminOnly}