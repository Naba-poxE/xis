import { Response } from 'express'
import { IReqAuth } from '../config/interface'
import Users from '../models/userModel'
import bcrypt from 'bcrypt'


const userCtrl = {
    updateUser : async( req:IReqAuth,res:Response ) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authentication!"})
        try {
            const { avatar, name } = req.body

            await Users.findOneAndUpdate({_id: req.user._id},{
                avatar,name
            })

            res.json({msg: "Update Success!"})
        } catch (err:any) {
            return res.status(500).json({msg: err.message})
        }
    },
    resetPassword : async( req:IReqAuth,res:Response ) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authentication!"})
        try {
            const { password } = req.body
            const passwordHash = await bcrypt.hash(password, 12)

            await Users.findOneAndUpdate({_id: req.user._id},{
                password: passwordHash
            })

            res.json({msg: "Reset password Success!"})
        } catch (err:any) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUser : async( req:IReqAuth,res:Response ) => {
        try {
            const user = await Users.findById(req.params.id).select('-password')
            res.json(user)
        } catch (err:any) {
            return res.status(500).json({msg: err.message})
        }
    },
    getAllUsers : async( req:IReqAuth,res:Response ) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authentication!"})
    
        if(req.user.role !== 'admin')
          return res.status(400).json({msg: "Invalid Authentication!"})

        try {
            const users = await Users.find().select('-password')
            
            res.json(users)
            
        } catch (err:any) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteUser : async( req:IReqAuth, res:Response ) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authentication!"})
    
        if(req.user.role !== 'admin')
          return res.status(400).json({msg: "Invalid Authentication!"})

        try {
            await Users.findByIdAndDelete({_id: req.params.id})

            res.json({msg:"Success! User deleted"})

        } catch (err:any) {
            return res.status(500).json({msg: err.message})
        }
    }
}

export default userCtrl;