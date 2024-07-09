import { NextFunction, Request, Response } from 'express';
import { createDeleteService, deleteUserService, excludedFields, getAllUsersService, updateUserService } from '../services/user.service';
import { UpdateUserInput, updateUserSchema } from '../schema/user.schema';
import { omit } from "lodash"; // used to create a new object that omits specified properties from an existing object for security eg password.
import AppError from '../utils/appError';
import { Prisma } from '@prisma/client';
import { clearCookies, getLocalTime } from '../utils/helpers';
import redisClient from '../utils/connectRedis';


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


// Update User Profile
export const updateUserHandler = async (
    req: Request<{}, {}, UpdateUserInput>,
    res: Response,
    next: NextFunction,
) => {

    try {
        const user = res.locals.user;
        const { ...data } = req.body;

        // Validate if data matches the UpdateUserInput type
        const validationResult = updateUserSchema.safeParse({body: data});

        if (validationResult.success === false) {
            // If validation fails, send a 400 Bad Request response with validation errors
            return next(new AppError(400, JSON.stringify({
                status: 'error',
                message: 'Input Validation failed',
                errors: validationResult.error.flatten(), // Flatten errors for better readability
            })));
        }

        // If validation passes, proceed with updating the user
        const updatedUserData = await updateUserService({id: user.id},data);
        const updatedUser = omit(updatedUserData, excludedFields);
        res.status(200).json(updatedUser);

    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientValidationError) {
                return next(new AppError(400, JSON.stringify({
                    status: 'error',
                    message: 'Input Passed is not defined',
                    // errors: error.message, 
                })));
        }

        next(error);
    }
};


// Delete User and Update DeletedUsers Table.

export const deleteUserHandler = async (
    req: Request<{}, {}, UpdateUserInput>,
    res: Response,
    next: NextFunction,
) => {

    try {
        const { id, name, email,image, ...info} = res.locals.user;
        const deleteDate = new Date(getLocalTime());
        await createDeleteService({
            deletedAt:deleteDate,
            originalId:id,
            name,
            email,
            image,
        });

        try {
            await deleteUserService({id});
                try {
                    await redisClient.del(id);
                    clearCookies(res);
                    
                } catch (error) {
                    next(error);
                    
                }
            res.status(200).json({
                status: 'success',
                message:"User was Deleted Successfully!"
            });
            
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'There was an error Deleting User',
            });
            
        }


    } catch (error:any) {
        next(error);  
    }
}