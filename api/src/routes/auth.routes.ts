import express from "express";
import { forgotPasswordHandler, loginUserHandler, logoutUserHandler, refreshAccessTokenHandler, registerUserHandler, resetPasswordHandler, verifyEmailHandler } from "../controllers/auth.controllers";
import { validate } from "../middleware/validate";
import { forgotPasswordSchema, loginUserSchema, registerUserSchema, resetPasswordSchema, verifyEmailSchema } from "../schema/user.schema";
import { requireUser } from "../middleware/require";
import { deserializeUser } from "../middleware/deserializeUser";

const router = express.Router();

router.post('/register',validate(registerUserSchema), registerUserHandler);
router.post('/login', validate(loginUserSchema), loginUserHandler);
router.post('/refresh',refreshAccessTokenHandler);
router.get('/logout',deserializeUser, requireUser, logoutUserHandler);
router.get('/verifyemail/:verificationCode', validate(verifyEmailSchema), verifyEmailHandler);
router.post('/forgotpassword',validate(forgotPasswordSchema),forgotPasswordHandler);
router.patch('/resetpassword/:resetToken',validate(resetPasswordSchema),resetPasswordHandler);


export default router;