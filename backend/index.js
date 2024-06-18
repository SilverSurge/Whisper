// const express = require('express') // Method 1
// method 2, in package.json use "type": "module"
import express from 'express';
import dotenv from 'dotenv';
dotenv.config({})
import connectDB from './config/database.js';
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();

const PORT = process.env.PORT || 5000;
// middleware
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cookieParser());
const corsOption={
    origin:'http://localhost:3000',
    credentials:true
};
app.use(cors(corsOption))

// routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute)
// http://localhost:8080/api/v1/user/register

app.listen(PORT, () => {
    connectDB();
    console.log(`server listening on port ${PORT}`);
})

// complete