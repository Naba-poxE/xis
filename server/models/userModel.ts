import mongoose from 'mongoose';
import { IUser } from '../config/interface';

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        require:[true, "Please Enter your Name"],
        trim:true,
        maxLength:[20,"Your name should not exceed 20 character"]
    },
    email: {
        type:String,
        require:[true, "Please Enter your Email"],
        trim:true,
        unique:true
    },
    password: {
        type:String,
        require:[true, "Please Enter your Password"],
    },
    avatar: {
        type:String,
        default:'https://res.cloudinary.com/dpra6ghs3/image/upload/v1633087910/procure/avatar_qr5wiw.svg'
    },
    role: {
        type:String,
        default: 'writer' //admin
    },
    type: {
        type:String,
        default: 'register' //login
    },
    rf_token: {
        type: String,
        select: false
    }
},{
    timestamps: true
})

export default mongoose.model<IUser>('user',userSchema)