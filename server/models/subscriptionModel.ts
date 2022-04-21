import mongoose from 'mongoose'


const subscriptionSchema = new mongoose.Schema({
    email: {
        type: String
    }
},{
    timestamps: true
})

export default mongoose.model('subscription',subscriptionSchema)