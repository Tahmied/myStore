import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    userName : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true, 
        index: true
    } ,
    email : {
        type: String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true
    },
    firstName : {
        type: String,
        required: true,
        trim : true
    },
    secondName : {
        type: String,
        required: true,
        trim : true
    } ,
    password : {
        type:String,
        required : true
    },
    avatar : {
        type : String,
        required : true
    },
    coverImage : {
        type:String
    },
    description : {
        type: String
    },
    bookCollection : [
        {
            type: Schema.Types.ObjectId,
            ref : 'Book'
        }
    ],
    refreshToken : {
        type : String
    }
}, {
    timestamps : true
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      return next();
    }
  
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      return next(error);
    }
  });

  userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
 };
 

userSchema.methods.generateAccessToken = async function (){
    return jwt.sign(
        {
            _id: this._id,
            email : this.email
        } ,
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function() {
   return jwt.sign(
        {
            _id: this._id
        } ,
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User" , userSchema)