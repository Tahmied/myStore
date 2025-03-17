import { Book } from "../models/book.model.js";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addBook = asyncHandler(async (req,res) => {
    const user = await User.findById(req.user._id)
    if(!user) {
        throw new apiError(400 , 'unable to find the user from cookies')
    }
    const {title , pageCount , bookDescription} = req.body
    if([title,pageCount,bookDescription].some((e)=>!e)){
        throw new apiError(400 , 'Title, page and book description are required fields')
    }

    const checkBook = await Book.findOne({title : title})
    console.log(`New one - ${title} ,  found one - ${checkBook.title}`);
    if(checkBook) {
        throw new apiError(400 , 'this book is already added')
    }
    
    const pdfLocalPath = req.files?.bookPdf[0].path
    const coverLocalPath = req.files?.bookCover[0].path
    
    if([pdfLocalPath,coverLocalPath].some((e)=>!e)){
        throw new apiError(400 , 'unable to find pdflocal path and cover local path')
    }
    const bookPdf = await uploadOnCloudinary(pdfLocalPath)
    const coverImage = await uploadOnCloudinary(coverLocalPath)
    if([bookPdf , coverImage].some((e)=>!e)){
        throw new apiError(400 , 'unable to find uploaded response from cloudinary in book controller')
    }

    const book = await Book.create({
        title,
        bookCover : coverImage.url,
        pdf : bookPdf.url,
        pageCount,
        bookDescription,
        author : user._id
    })

    return res
    .status(200)
    .json(
        new apiResponse(200 , 'book uploaded successfully' , book)
    )
})

const allBooks = asyncHandler(async (req,res) => {
    const book = await Book.find({})
    const booksArray = Object.keys(book)
    const bookCount = booksArray.length
    return res
    .status(200)
    .json(
        new apiResponse(200 , `${bookCount} books are fetched` , book)
    )
})
export { addBook, allBooks };

