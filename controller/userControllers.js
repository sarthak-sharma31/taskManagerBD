import {Task} from '../models/Task.js';
import {User} from '../models/User.js';
import bcrypt from 'bcryptjs';

const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "member" }).select("-password");
        const usersWithTaskCounts = await Promise.all(users.map(async (user) => {
            const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "Pending" });
            const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "In Progress" });
            const CompletedTasks = await Task.countDocuments({ assignedTo: user._id, status: "Completed" });

            return {
                ...user._doc,
                pendingTasks,
                inProgressTasks,
                CompletedTasks
            }
        }));
        return res.status(200).json({ usersWithTaskCounts });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if(!user) return res.status(400).json({message: "User not found"});
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export { getUsers, getUserById }