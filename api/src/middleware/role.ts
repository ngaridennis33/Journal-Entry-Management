import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";

/**
 * Middleware to check user role for authorization.
 * 
 * @param req The request object.
 * @param res The response object.
 * @param next The next function to call in the middleware chain.
 */
export const checkUserRole = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get the user role from response locals
        const userRole = res.locals.user?.role;
        
        // Check if the user role is 'admin'
        if (userRole === 'admin') {
            // If user role is 'admin', proceed to next middleware or route handler
            return next();
        } else {
            // If user role is not 'admin', throw a forbidden error
            next(new AppError(403, 'Forbidden!'));
        }
    } catch (err) {
        // Handle any errors
        next(err);
    }
};