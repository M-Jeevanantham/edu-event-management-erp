import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
logoutUser
} from '../Controllers/authControllers.js';
import { protect } from '../Middleware/authMiddleware.js';

const authRouter = express.Router();

// Register new user
authRouter.post('/register', registerUser);

// Login user
authRouter.post('/login', loginUser);

// Get logged-in user profile
authRouter.get('/profile', protect, getUserProfile);

authRouter.post('/logout', logoutUser);
export default authRouter;
