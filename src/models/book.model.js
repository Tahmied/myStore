import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema({
    title : {
        type : String,
        required : true,
        index : true
    } ,
    bookCover : {
        type : String,
        required : true
    } ,
    pdf : {
        type : String,
        required : true
    } ,
    pageCount : {
        type : Number,
        requred : true
    },
    bookDescription : {
        type : String , 
        required : true
    } ,
    author : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
}, {
    timestamps : true
})

export const Book = mongoose.model('Book' , bookSchema)