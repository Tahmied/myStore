import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        if(!user){
            throw new apiError(`Unable to find the user to generate tokens`)
        }
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        if(!accessToken || !refreshToken) {
            throw new apiError(`Unable to generate tokens`)
        }
        return {accessToken , refreshToken}
    } catch (err) {
        throw new apiError(500 , `couldn't got into the token generation due to  ${err}`)
    }
}

const registerUser = asyncHandler(async (req,res) => {
    const {userName , email , firstName , secondName , password, description} = req.body
    if([userName,email, firstName , secondName , password].some((e)=>!e)){
        throw new apiError(400 , "Some required fields are missing")
    }

    const avatar = await req.files?.avatar[0].path
    if(!avatar) {
        throw new apiError(400 , 'Failed to fetch the local path of avatar, multer file upload failed')
    }
    let coverImage ;
    try {
        coverImage = await req.files?.coverImage[0].path
    } catch (err) {
        coverImage = 'cover image upload failed'
    }

    const avatarUpload = await uploadOnCloudinary(avatar)
    const coverImageUpload = await uploadOnCloudinary(coverImage)

    if(!avatarUpload || !coverImageUpload) {
        throw new apiError(400, "unable to upload images on cloudinary")
    }

    const user = await User.create({
        userName : userName.toLowerCase(),
        email,
        firstName,
        secondName,
        password,
        avatar : avatarUpload.url,
        coverImage : coverImageUpload.url,
        description
    })
    
    res
    .status(200)
    .json(
        new apiResponse(200 , "user registration successfull" , user)
    )
})

const loginUser = asyncHandler(async (req , res) => {
    const {userName, email , password} = req.body

    if(!userName && !email) {
        throw new apiError(400 , "Please enter user name or email")
    }

    if(!password){
        throw new apiError(401, "Password is a required field")
    }

    const user = await User.findOne({
        $or: [{ userName: userName }, { email: email }]
    })
    if(!user) {
        throw new apiError(401, "couldn't find the user")
    }

    const isPassCorrect = await user.isPasswordCorrect(password)
    if(!isPassCorrect) {
        throw new apiError(401 ,"Wrong password")
    }
    
    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id)
    if(!accessToken || !refreshToken) {
        throw new apiError(500 , "where is the tokens?")
    }
    
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave:false})

    var cookieOptions = {
        httpOnly :true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken" , accessToken , cookieOptions)
    .cookie("refreshToken" , refreshToken, cookieOptions)
    .json(
        new apiResponse(200 , "User login successful")
    )
})

const logOutUser = asyncHandler(async (req,res) => {
    const user = await req.user
    
    if(!user) {
        throw new apiError(400, 'unable to find the user')
    }
    user.refreshToken = null
    await user.save({validateBeforeSave:false})
    let cookieOptions = {
        httpOnly :true,
        secure:true
    }
    res
    .status(200)
    .clearCookie('accessToken' , cookieOptions)
    .clearCookie('refreshToken' , cookieOptions)
    .json(
        new apiResponse(200 , 'user logged out successfully')
    )
})

export { loginUser, logOutUser, registerUser };

