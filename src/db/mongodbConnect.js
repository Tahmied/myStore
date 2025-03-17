import mongoose from "mongoose";
import { databaseName } from '../constants.js';

const connectDb = async (req,res) => {
    try {
        const response = await mongoose.connect(`${process.env.DATABASE_URI}/${databaseName}`)
        console.log(`Connected to mongo db on ${response.connection.host}`);
    } catch (err) {
        console.log(`something went wrong while connecting to db due to ${err}`);
    }
}

export { connectDb };

