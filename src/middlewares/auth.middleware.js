import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js"
import { apiError } from "../utils/apiError.js"
import { asyncHandler } from '../utils/asyncHandler.js'

const findUserFromCookies = asyncHandler(async function (req , _ ,next) {
    try {
        const readToken = req.cookies?.accessToken || req.header("Authorization")?.replace('Bearer ', '')
        if(!readToken) {
            throw new apiError(400 , "Unable to read the access token")
        }
        const decodedToken = jwt.verify(readToken , process.env.ACCESS_TOKEN_SECRET)
        if(!decodedToken) {
            throw new apiError(401, "Unable to decode the token")
        }
        const user = await User.findById(decodedToken._id)
        if(!user){
            throw new apiError(400 , `unable to find the user from cookies`)
        }
        req.user = user
        next()
    } catch (err) {
        throw new apiError( 400, `Unable to check the user due to ${err}`)
    }
})

export { findUserFromCookies }

