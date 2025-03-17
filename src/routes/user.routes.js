import { Router } from "express"
import { loginUser, logOutUser, registerUser } from "../controllers/user.controller.js"
import { findUserFromCookies } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
const router = Router()

router.route('/register').post( upload.fields([
    {
        name: 'avatar',
        maxCount : 1
    },
    {
        name: 'coverImage',
        maxCount : 1
    }
]) , registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(findUserFromCookies , logOutUser)

export default router