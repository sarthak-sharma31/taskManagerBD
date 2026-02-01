import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {User} from '../models/User.js';

const generateToken = (userId)=>{
    return jwt.sign({id:userId}, process.env.JWT_SECRET, {expiresIn: "7d"});
}

const registerUser = async (req, res) => {
    try {
        let { name, email, password, profileImageUrl, adminInviteToken } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        if (!profileImageUrl) {
            profileImageUrl = "http://localhost:3000/uploads/1769959202499-03ebd625cc0b9d636256ecc44c0ea324.jpg";
        }

        let role = "member";
        if (
            adminInviteToken &&
            adminInviteToken === process.env.ADMIN_INVITE_TOKEN
        ) {
            role = "admin";
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role,
        });

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


const loginUser = async(req, res)=>{
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: "Incorrect Password"});
        }

        return res.status(200).json({_id: user._id, name: user.name, email: user.email, role: user.role, profileImageUrl: user.profileImageUrl, token: generateToken(user._id)})

    } catch (error) {
        return res.status(500).json({message: "Internal Server Error", error: error.message});
    }
};

const getUserProfile = async (req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const updateUserProfile = async(req, res)=>{
    try {
        const user = await User.findById(req.user._id);

        if(!user) return res.status(400).json({message: "User not found"});

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt)
        }

        const updatedUser = await user.save();
        return res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id)
        });
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error", error: error.message});
    }
};

export{registerUser, loginUser, getUserProfile, updateUserProfile}