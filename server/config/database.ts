import mongoose from "mongoose";

// const URI = process.env.MONGODB_URL

const url = 'mongodb://172.105.38.61:25415/tipsaza'

mongoose.connect(`${url}`,{
    useCreateIndex : true,
    useFindAndModify:true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) throw err;
    console.log("MongoDB connected")
})