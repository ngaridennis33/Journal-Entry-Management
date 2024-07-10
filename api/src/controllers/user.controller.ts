import { NextFunction, Request, Response } from 'express';
import {excludedFields } from '../services/user.service';
import { omit } from "lodash"; // used to create a new object that omits specified properties from an existing object for security eg password.


// GET get User Handler(LoggedIn User Session)
export const getMeHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    try {
    const user = res.locals.user;
    const loggedInUser = omit(user,excludedFields);
    res.status(200).status(200).json({
        status: 'success',
        data: {
            loggedInUser,
        },
    });
    } catch (err: any) {
    next(err);
    }
};
