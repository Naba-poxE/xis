"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        require: [true, "Please Enter your Name"],
        trim: true,
        maxLength: [20, "Your name should not exceed 20 character"]
    },
    email: {
        type: String,
        require: [true, "Please Enter your Email"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: [true, "Please Enter your Password"],
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/dpra6ghs3/image/upload/v1633087910/procure/avatar_qr5wiw.svg'
    },
    role: {
        type: String,
        default: 'writer' //admin
    },
    type: {
        type: String,
        default: 'register' //login
    },
    rf_token: {
        type: String,
        select: false
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('user', userSchema);
