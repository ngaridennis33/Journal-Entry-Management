import { Request, Response,NextFunction } from "express";
import {omit} from 'lodash';
import { excludedFields, findUniqueUserService } from "../services/user.service";
import AppError from "../utils/appError";
import redisClient from "../utils/connectRedis";
import { verifyJwt } from "../utils/jwt";


/**
 * deserializeUser Middleware function, receives a request, response, and next function parameters.
 * 
 * Verifies the validity of an access token extracted from request headers or cookies.
 * Decodes the token to obtain the user ID and checks for a corresponding session in Redis.
 * Retrieves user details from the database based on the session information.
 * Attaches the user object (excluding sensitive fields) to the response locals.
 * 
 * @param req The request object.
 * @param res The response object.
 * @param next The next function to call in the middleware chain.
 */

export const deserializeUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let access_token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            access_token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.access_token) {
            access_token = req.cookies.access_token;
        }
    

        if (!access_token) {
            return next(new AppError(401, 'You are not logged in'));
        }

        // Validate the access token
        const decoded = verifyJwt<{ sub: string }>(
        access_token,
        'accessTokenPublicKey'
        );

        if (!decoded) {
            return next(new AppError(401, `Invalid token or user doesn't exist`));
        }

        // Check if the user has a valid session
        const session = await redisClient.get(decoded.sub);

        if (!session) {
            return next(new AppError(401, 'Invalid token or session has expired'));
        }

        // Check if the user still exists
        const user = await findUniqueUserService({ id: JSON.parse(session).id });
        
        // Add user to res.locals to allow you access the user object later in subsequent middleware.
        res.locals.user = omit(user, excludedFields);

        next();

    } catch (err: any) {
        next(err);
    }
};