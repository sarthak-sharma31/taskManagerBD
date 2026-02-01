import express from "express";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import {getTasks, getTaskByID, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist, getUserDashboardData, getDashboardData, getMyTasks} from '../controller/taskControllers.js'

const router = express.Router();

router.get('/dashboard-data', protect, getDashboardData);
router.get('/user-dashboard-data', protect, getUserDashboardData);
router.get('/my', protect, getMyTasks);

router.get('/', protect, getTasks);
router.get('/:id', protect, getTaskByID);

router.post('/', protect, adminOnly, createTask);

router.put('/:id', protect, updateTask);
router.delete('/:id', protect, adminOnly, deleteTask);
router.put('/:id/status', protect, updateTaskStatus);
router.put('/:id/todo', protect, updateTaskChecklist);
export default router;