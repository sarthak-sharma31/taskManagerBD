import { adminOnly, protect } from "../middleware/authMiddleware.js";
import express from "express";
import { getUserById, getUsers } from "../controller/userControllers.js";

const router = express.Router();

router.get('/', protect, adminOnly, getUsers);
router.get('/:id', protect, getUserById);

export default router;