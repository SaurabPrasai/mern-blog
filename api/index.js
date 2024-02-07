
import express from "express";
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRouter from './routes/userRoute.js'

dotenv.config()

const app = express();

//database connecteion
mongoose.connect(process.env.MONGO_URI_STRING)
.then(()=>{
    console.log("MongoDb Connected");
})
.catch((err)=>console.log(err))

//middleware
app.use('/api/user/',userRouter)

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});


app.get("/",(req,res)=>{
  res.send("From home page")
})

