// middleware that will parse the schemas and return error messages to the user.
import { AnyZodObject, ZodError } from 'zod'; //declaration and validation library designed to help you define and enforce data schemas.
import { Request, Response, NextFunction } from 'express';

export const validate =(schema: AnyZodObject) =>(
    req: Request, 
    res: Response,
    next:NextFunction) => {
    try {
    schema.parse({
        params: req.params,
        query: req.query,
        body: req.body,
    });

    next();
    } catch (error) {
    if (error instanceof ZodError) {
        return res.status(400).json({
        status: 'fail',
        errors: error.errors,
        });
    }
    next(error);
    }
};