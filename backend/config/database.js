// imports
import mongoose from "mongoose";

import dotenv from 'dotenv';
dotenv.config({})

// method to connect to the database
const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI).then(() =>{
        console.log("database connection established");
    }).catch((error) => {
        console.log(error);
    })
}
export default connectDB;