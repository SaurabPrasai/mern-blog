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
    user = await User.findOne({ username, email });
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
