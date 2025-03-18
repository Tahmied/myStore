import { Router } from 'express'
import { addBook, allBooks, bookPage } from '../controllers/book.controller.js'
import { findUserFromCookies } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'

const router = Router()
router.route('/add-book').post(findUserFromCookies, upload.fields([{
    name : 'bookPdf',
    maxCount : 1,
},{
    name : 'bookCover',
    maxCount : 1
}]) , addBook)

router.route('/books').get(allBooks)
router.route('/:bookId').get(bookPage)

export default router