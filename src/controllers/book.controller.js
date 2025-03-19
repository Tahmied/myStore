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

const bookPage = asyncHandler(async (req,res) => {
    const book = await Book.findById(req.params.bookId)
    const {addToCollection} = req.body
    const user = req.user
    let inColection;
    let collection;
    if(!book){
        throw new apiError(400 , 'unable to find the book id from url')
    }

    if(user.bookCollection.includes(req.params.bookId)){
        inColection = true
    } else {
        inColection = false
    }

    if(addToCollection !== undefined) {
        if(addToCollection !== 1 && addToCollection !== 0) {
            throw new apiError(400 , 'the value of addToCollection must be 1 or 0')
        }
    }

    if(inColection == false) {
        if(addToCollection === 1) {
            user.bookCollection.push(req.params.bookId)
            await user.save()
            collection = `added to the collection of the user`
        } else {
            collection = `book is not in the collection and the value of addToCollection is 0, so didn't remove from the collection`
        }
    }
    
    
    if(inColection == true){
        if(addToCollection === 0) {
            const bookIndex = user.bookCollection.indexOf(req.params.bookId)
            user.bookCollection.splice(bookIndex , 1)
            await user.save()
            collection = `removed from collection`
        } else {
            collection = `book is already in the collection and the value of addToCollection is 1, so didn't added to the collection `
        }
    }
   
    const bookName = book.title
    const bookCoverImage = book.bookCover
    const bookDownloadLink = book.pdf
    const bookPageCount = book.pageCount
    const description = book.bookDescription
    const authorName = book.author

    const bookDetails = {
        Name : bookName,
        CoverImage : bookCoverImage,
        downloadLink : bookDownloadLink,
        pages : bookPageCount,
        description : description,
        author : authorName,
        wasInCollection : inColection,
        collectionUpdate : collection
    }
    return res
    .status(200)
    .json(
        new apiResponse(200 , 'Book details fetched successfully' , bookDetails)
    )
})

export { addBook, allBooks, bookPage };

