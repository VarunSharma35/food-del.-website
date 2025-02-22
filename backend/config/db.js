import mongoose from "mongoose";

export const connectDB = async() => {
    await mongoose.connect('mongodb+srv://varunspharma666:bacend8352@cluster0.tc4gi.mongodb.net/food_del_website').then(()=>console.log("DB Connected"));
}