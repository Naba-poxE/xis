import { Response,Request } from 'express'
import { IReqAuth } from '../config/interface'
import { validateEmail } from '../middleware/valid'
import Subscription from '../models/subscriptionModel'



const subscriptionCtrl = {
    getEmails : async ( req: IReqAuth, res: Response ) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authentication!"})
    
        if(req.user.role !== 'admin')
          return res.status(400).json({msg: "Invalid Authentication!"})

        try {
            const subscribers = await Subscription.find().sort('-createdAt')

            res.json( subscribers )

        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    postEmail : async ( req: Request, res: Response ) => {
        try {
            const email = req.body.email

            const subscriber = await Subscription.findOne({email})
            if(subscriber) return res.status(400).json({msg: "Email already exists!"})

            if(validateEmail(email)) {
                const newEmail = new Subscription({email})
                await newEmail.save()
                res.json({msg: "Congrats! See you in your inbox"})
            }

        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteEmail : async ( req: IReqAuth, res: Response ) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authentication!"})

        if(req.user.role !== 'admin') return res.status(400).json({msg: "Invalid Authentication!"})

        try {
            const emails = await Subscription.findByIdAndDelete(req.params.id)
            if(!emails) return res.status(400).json({msg: "Email does not exists!"})

            res.json({msg: "Success! Email deleted"})

        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    }
}

export default subscriptionCtrl;