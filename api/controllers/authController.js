import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (
      !username ||
      !email ||
      !password ||
      username === "" ||
      email === "" ||
      password === ""
    ) {
      next(errorHandler(400,"All fields are required"))
    }
    //checking user exist
    let user;
    // user = await User.findOne({ username, email });
    user=await User.findOne({$or:[{username},{email}]})
    if (user) {
      next(errorHandler(400,"User already exist"))
    }
    //hashing password
    const hashedPassword = bcryptjs.hashSync(password, 10);
    //saving user in db
    user = await User.create({ username, email, password: hashedPassword });
    res.json({ msg: "New user created" });
  } catch (error) {
    next(error)
  }
};


export const signin=async(req,res,next)=>{
  const {email,password}=req.body;
  try {
     if(!email||!password||email===""||password===""){
      next(errorHandler(400,"All fields are required"))
     }
     let user;
     user=await User.findOne({email})
     if(!user){
      next(errorHandler(400,"Please enter an valid email"))
     }
     const isMatchPassword=bcryptjs.compareSync(password,user.password)
    
    //  performing other task

  } catch (error) {
    next(error)
  }
}
