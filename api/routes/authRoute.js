
import { Router } from "express";
import { google, signin, signup } from "../controllers/authController.js"

const router=Router();

router.post('/signup',signup)

router.post("/signin",signin)

router.post('/google',google)

export default router;