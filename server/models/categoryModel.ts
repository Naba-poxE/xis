import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please add your category"],
        unique: true,
        trim: true,
        maxLength: [50, "Name shouldn't be more than 50 chars long"],
    },
},{
    timestamps: true
})

export default mongoose.model('category',categorySchema)