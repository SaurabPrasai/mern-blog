import User from "../models/userModel.js";
import bcryptjs from "bcryptjs"
export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  //hashing password
  const hashedPassword=bcryptjs.hashSync(password,10)
  
  try {
   
    //saving user in db
    const newUser = await User.create({ username, email, password:hashedPassword });
    res.json({ msg: "New user created" });
  } catch (error) {
    res.status(500).json({ msg: "User not created" });
  }
};
