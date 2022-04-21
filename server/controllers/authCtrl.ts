import { Request,Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Users from '../models/userModel';
import { generateActiveToken,generateAccessToken,generateRefreshToken } from '../config/generateToken';
import sendEmail from '../config/sendMail';
import { validateEmail } from '../middleware/valid';
import { IReqAuth } from '../config/interface';

import { IDecodedToken,IUser } from '../config/interface';

const CLIENT_URL = process.env.BASE_URL

const authCtrl = {

    register : async (req: IReqAuth, res: Response) => {

        // if(!req.user) return res.status(400).json({msg: "Invalided Authentication!"})
    
        // if(req.user.role !== 'admin')
        //   return res.status(400).json({msg: "Invalid Authentication!"})

        try {
            const { name,email,password } = req.body

            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg:"This email already exists!"})

            const passwordHash = await bcrypt.hash(password,12)

            const newUser = { name,email,password:passwordHash }

            const active_token = generateActiveToken({newUser})
            
            const url = `${CLIENT_URL}/active/${active_token}`

            if(validateEmail(email)) {
                sendEmail(email,url,"Verify your email")
                return res.json({msg:"Success! Please make them check their email"})
            }

        } catch (err: any) {
            return res.status(500).json({msg:err.message})
        }
    },
    activeAccount : async (req: Request, res: Response) => {
        try {
            const { active_token } = req.body;

            const decoded = <IDecodedToken> jwt.verify(active_token,`${process.env.ACTIVE_TOKEN_SECRET}`)

            const { newUser } = decoded

            if(!newUser) return res.status(400).json({msg:"Invalid Authentication!"})

            const user = await Users.findOne({email: newUser.email})
            if(user) return res.status(400).json({msg:"This user already exists!"})

            const new_user = new Users(newUser)
            await new_user.save()

            res.json({msg:"Success! their account has been activated"})

        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    login : async (req: Request, res: Response) => {
        try {
            const { email,password } = req.body

            const user = await Users.findOne({email})
            if (!user) return res.status(400).json({msg:"Incorrect email or password!"})

            //if exists;
            loginUser(user,password,res)

        } catch (err:any) {
            return res.status(500).json({msg:err.message}) 
        }
    },
    logout : async (req: IReqAuth, res: Response) => {
        if(!req.user) return;
        try {
            res.clearCookie('refreshtoken',{ path:'/api/refresh_token' })

            await Users.findOneAndUpdate({_id: req.user.id},{
                rf_token: ''
            })

            res.json({msg:"Logged out successfully!"})

        } catch (err:any) {
            return res.status(500).json({msg:err.message})
        }
    },
    refreshToken : async (req: Request, res: Response) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if(!rf_token) return res.status(400).json({msg:"Please Login now!"})
            
            const decoded = <IDecodedToken>jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`)
            if(!decoded.id) return res.status(400).json({msg:"Please Login now!"})

            const user = await Users.findById(decoded.id).select("-password +rf_token")
            if(!user) return res.status(400).json({msg:"This account doesn't exists!"})

            if(rf_token !== user.rf_token) return res.status(400).json({msg:"Please Login now!"})

            const access_token = generateAccessToken({id: user._id})
            const refresh_token = generateRefreshToken({id: user._id}, res)

            await Users.findOneAndUpdate({_id: user._id},{
                rf_token: refresh_token
            })
            
            res.json({access_token,user})

        } catch (err: any) {
            return res.status(500).json({msg:err.message})
        }
    },
    forgotPassword : async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            
            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "This email does not exists!"})

            const access_token = generateAccessToken({id: user._id})

            const url = `${CLIENT_URL}/reset_password/${access_token}`

            if(validateEmail(email)) {
                sendEmail(email,url,"Reset your password")
                res.json({msg: "Success! Please check your email"})
            }

        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
}


const loginUser = async (user:IUser, password:string, res:Response) => {
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) return res.status(400).json({msg:"Incorrect Email or Password"})

    const access_token = generateAccessToken({id: user._id})
    const refresh_token = generateRefreshToken({id: user._id}, res)

    await Users.findOneAndUpdate({_id: user.id },{
        rf_token: refresh_token
    })

    res.json({
        msg:'Login Success!',
        access_token,
        user: {...user._doc, password:''}
    })
}


export default authCtrl;