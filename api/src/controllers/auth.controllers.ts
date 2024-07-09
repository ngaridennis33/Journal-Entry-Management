import { ForgotPasswordInput, LoginUserInput, RegisterUserInput, ResetPasswordInput, VerifyEmailInput } from './../schema/user.schema';
import { Request, Response, NextFunction, CookieOptions } from "express"; // NextFunction is a callback function that can be called to pass control to the next middleware or route handler in the stack.
import crypto from "crypto"; // Performs various hashing, encryption and decryption methods.
import bcrypt from 'bcryptjs'; //Hashing algorithm to  enhance the security of password storage.
import { createUserService, findUniqueUserService, findUserService, signTokens, updateUserService } from "../services/user.service";
import { Prisma } from "@prisma/client";
import config from "config";
import AppError from '../utils/appError';
import { signJwt, verifyJwt } from '../utils/jwt';
import redisClient from '../utils/connectRedis';
import Email from '../utils/email';
import { getLocalTime, clearCookies } from '../utils/helpers';

// Define options for HTTP cookies
const cookiesOptions: CookieOptions = {
    // Set the 'httpOnly' option to true
    // This means that the cookie is accessible only through HTTP(S) requests
    // and cannot be accessed via client-side scripts (JavaScript running in the browser)
    httpOnly: true,

    // Set the 'sameSite' option to 'lax'
    // This controls when cookies are sent with cross-site requests
    // 'lax' means cookies will only be sent in a top-level navigation (e.g., following a link)
    // and will not be sent along with cross-site requests initiated by third-party websites
    // This is a security measure to prevent unauthorized websites from making requests to your server on behalf of the user
    sameSite: 'lax',
};

// This describes how long the accessTokens are going to last.
const accessTokenCookieOptions: CookieOptions = {
    ...cookiesOptions,
    expires:new Date(getLocalTime().getTime() + config.get<number>('accessTokenExpiresIn') * 60 * 1000),
    maxAge: config.get<number>('accessTokenExpiresIn') * 60 * 1000,
};

// This explains how long the refreshTokens are going to last.
const refreshTokenCookieOptions: CookieOptions = {
    ...cookiesOptions,
    expires:new Date(getLocalTime().getTime()  + config.get<number>('refreshTokenExpiresIn') * 60 * 1000
    ),
    maxAge: config.get<number>('refreshTokenExpiresIn') * 60 * 1000,
};


// POST Register User Handler

export const registerUserHandler = async(
    req: Request<{}, {}, RegisterUserInput>,
    res:Response,
    next: NextFunction, 
    ) => {
        try {
            const { email, password, name } = req.body;
            const hashedPassword = await bcrypt.hash(password, 12);

            const verifyCode = crypto.randomBytes(32).toString('hex');
            const verificationCode = crypto.createHash('sha256').update(verifyCode).digest('hex');

            const user = await createUserService({
                name: name,
                email: email.toLowerCase(),
                password: hashedPassword,
                verificationCode,
            })

             // Handle sending the email with the verification code.
            const redirectUrl = `${config.get<string>(
                'origin'
            )}8000/api/auth/verifyemail/${verifyCode}`;
            

            try {
                await new Email(user, redirectUrl).sendVerificationCode();
                await updateUserService({id:user.id},{verificationCode});

                res.status(201).json({
                    status: 'success',
                    message:
                        `An email with a verification code has been sent to: ${email}`,
                });
            } catch (error) {
                await updateUserService({ id: user.id }, { verificationCode: null });
                return res.status(500).json({
                    status: 'error',
                    message: 'There was an error sending email, please try again',
                });
            }

            
        } catch (err: any) {
            // Catch any errors thrown in the try block
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
            // Check if the error is a known Prisma client error
            if (err.code === 'P2002') {
            // Check if the Prisma error code is 'P2002'
            return res.status(409).json({
                status: 'fail',
                message: 'Email already exists, please use another email address',
            });
            }
        }
        // If the error is not a known Prisma client error or has a different code, pass it to the next middleware
        next(err);
        }
    }

//GET Verify Email Handler

export const verifyEmailHandler = async (
    req: Request<VerifyEmailInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const verificationCode = crypto
            .createHash('sha256')
            .update(req.params.verificationCode)
            .digest('hex');
        
        const user = await updateUserService(
            {verificationCode},
            {verified: true, verificationCode: null},
            {email: true}
        );

        if(!user) {
            return next (new AppError(401, 'Could not verify email'));
        }

        // Redirect to the frontend email verified page
        const redirectUrl = `${config.get<string>(
            'frontEndOrigin'
        )}verify-email?title=Email%20Verification%20Complete&res=Your%20email%20has%20been%20verified%20successfully.`;
        
        res.redirect(redirectUrl);
        
    } catch (err: any) {
        if (err.code === 'P2025') {
            return res.status(403).json({
            status: 'fail',
            message: `Verification code is invalid or user doesn't exist`,
            });
        }
        next(err);
    }
};

// POST login User Handler

export const loginUserHandler = async (
    req: Request<{}, {}, LoginUserInput>,
    res: Response,
    next: NextFunction
) => {

    try {
        
        const {email, password} = req.body;

        const user = await findUniqueUserService(
            // Check if the email is in the database.
            { email: email.toLowerCase() },

            // If the email is in the db, return these fields.
            {id: true, email: true, password: true, verified: true}
            );

            if (!user) {
                return next(new AppError(400, 'Invalid email or password'));
            }

            // Check if user is verified
            if (!user.verified) {
                return next(
                new AppError(
                    401,
                    'You are not verified, please verify your email to login'
                )
                );
            }

            // if the user doesn't exist or the decrypted hashed password is not correct, return error.
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return next(new AppError(400, 'Invalid email or password'));
            } 

            // Sign Tokens
            const {access_token, refresh_token} = await signTokens(user);

            // Save the tokens in a cookie
            res.cookie("access_token", access_token, accessTokenCookieOptions); 
            res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
            
            // Set a cookie 'logged_in' with the value true, commonly used for tracking login status. Setting httpOnly to false makes it accessible to client-side JavaScript.
            res.cookie('logged_in', true, {
                ...accessTokenCookieOptions,
                httpOnly: false,
            });

            res.status(200).json({
                status: 'success',
                access_token,
            });

    } catch (error: any) {
        next(error)
    }
}

//POST forgotPassword Handler

export const forgotPasswordHandler = async (
    req: Request<
        Record<string, never>,
        Record<string, never>,
        ForgotPasswordInput
    >,
    res: Response,
    next: NextFunction
    ) => {
    try {
        // Get the user from the collection
        const email = req.body.email.toLowerCase();
        const user = await findUserService({ email: req.body.email.toLowerCase() });
        const message = `A reset verification email has been sent to: ${email} if the associated email address is registered with a user. The email reset link will expire in 10 minutes.`;
        
        if (!user) {
            return res.status(200).json({
                status: 'success',
                message,
            });
        }

        if (!user.verified) {
        return res.status(403).json({
            status: 'fail',
            message: 'Account not verified',
        });
        }

        if (user.provider) {
        return res.status(403).json({
            status: 'fail',
            message:
            'We found your account. It looks like you registered with a social auth account. Try signing in with social auth.',
        });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

        await updateUserService(
        { id: user.id },
        {
            passwordResetToken,
            passwordResetAt:new Date(getLocalTime().getTime() + 10 * 60 * 1000),
        },
        { email: true }
        );

        try {
        const url = `${config.get<string>('origin')}3000/resetpassword?token=${resetToken}`;
        await new Email(user, url).sendPasswordResetToken();

        res.status(200).json({
            status: 'success',
            message,
        });
        } catch (err: any) {
        await updateUserService(
            { id: user.id },
            { passwordResetToken: null, passwordResetAt: null },
        );
        return res.status(500).json({
            status: 'error',
            message: 'There was an error sending email',
        });
        }
    } catch (err: any) {
        next(err);
    }
};

// PATCH resetPasswordHandler

export const resetPasswordHandler = async (
    req: Request<
    ResetPasswordInput['params'],
    Record<string, never>,
    ResetPasswordInput['body']
    >,
    res: Response,
    next: NextFunction
) => {
    try {
    // Get the user from the collection
    const passwordResetToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');

    const user = await findUserService({
        passwordResetToken,
        passwordResetAt: {
        gt: new Date(),
        },
    });

    if (!user) {
        return res.status(403).json({
        status: 'fail',
        message: 'Invalid token or token has expired',
        });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    // Change password data
    await updateUserService(
        {
        id: user.id,
        },
        {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetAt: null,
        },
        { email: true }
    );

    clearCookies(res);
    res.status(200).json({
        status: 'success',
        message: 'Password data updated successfully',
    });
    } catch (err: any) {
    next(err);
    }
};

// POST refreshAccessTokenHandler

export const refreshAccessTokenHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const refresh_token = req.cookies.refresh_token;
        const message = 'Could not refresh Access Token';

        if (!refresh_token){
            return next(new AppError(403, message));
        }

        // Validate the refresh token
        const decoded = verifyJwt<{sub: string}>(
            refresh_token,
            'refreshTokenPublicKey'
        )
        if (!decoded) {
            return next( new AppError(403, message));
        }

        // Check if the user has a valid session
        const session = await redisClient.get(decoded.sub);

        if (!session) {
            return next(new AppError(403, message));
        }

        // Check of the user still exists
        const user = await findUniqueUserService({ id: JSON.parse(session).id });

        if (!user) {
            return next(new AppError(403, message));
        }

        // Sign new access Token
        const access_token = signJwt({ sub: user.id }, 'accessTokenPrivateKey', {
            expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
        });

        // 4. Add Cookies
        res.cookie('access_token', access_token, accessTokenCookieOptions);
        res.cookie('logged_in', true, {
            ...accessTokenCookieOptions,
            httpOnly: false,
        });

        // 5. Send response
        res.status(200).json({
            status: 'success',
            access_token,
            });
        } catch (err: any) {
            next(err);
    }
};

// DELETE Logout user handler

export const logoutUserHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = res.locals.user;
        await redisClient.del(user.id);
        clearCookies(res);
        res.status(200).json({
            status: 'success',

        })
    } catch (err: any) {
        next(err)
    }
}