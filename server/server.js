import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './Config/db.js';
import authRouter from './Routes/authRouter.js';
import cookieParser from 'cookie-parser';
import userRouter from './Routes/userRouter.js'
import institutionRoutes from './Routes/institutionRoutes.js'
import registrationRoutes from './Routes/registrationRoutes.js';
import educatorRoute from './Routes/educatorRouter.js'
const app = express();
dotenv.config();
app.set('trust proxy', 1);
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // React app origin
  credentials: true,               // Allow cookies
}));
app.use(express.json());
app.use((req,res,next)=>{
    console.log(`${req.path}   ${req.method}`);
    next();
})
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/institution',institutionRoutes)
app.use('/api/student', registrationRoutes);
app.use('/api/educator',educatorRoute)

connectDB().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`PORT:${process.env.PORT}`)
})
})
