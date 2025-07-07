// routes/userRouter.js
import express from 'express';
import { protect } from '../Middleware/authMiddleware.js';
import { getUserProfile } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);

export default router;
