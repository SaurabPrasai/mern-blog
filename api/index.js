
import express from "express";
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const app = express();

mongoose.connect(process.env.MONGO_URI_STRING)
.then(()=>{
    console.log("MongoDb Connected");
})
.catch((err)=>console.log(err))

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});


