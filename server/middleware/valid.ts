import { Request,Response,NextFunction } from 'express';


export const validRegister = async (req:Request,res:Response,next:NextFunction) => {
    const { name,email,password } = req.body

    const errors = [];

    if(!name) {
        errors.push("Please fill in your name")  //push the item to the array errors;
    }else if(name.length > 20){
        errors.push("Your name should not exceed 20 character")
    }

    if(!email) {
        errors.push("Please fill in your email")
    }else if(!validateEmail(email)) {
        errors.push("Invalid email! Please check again")
    }

    if(!password) {
        errors.push("Please fill in your password")
    }else if(password.length < 6) {
        errors.push("Password must be at least 6 character long")
    }

    if(errors.length > 0) return res.status(400).json({msg:errors})

    next();
}

export function validateEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}