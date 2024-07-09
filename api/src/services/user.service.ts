import redisClient from './../utils/connectRedis';
import { PrismaClient, Prisma, User, DeletedUser } from "@prisma/client";
import config from 'config';
import { signJwt } from '../utils/jwt';

export const excludedFields = [
    "password",
    "verified",
    "verificationCode",
    "passwordResetAt",
    "passwordResetToken",
];

const prisma = new PrismaClient();

// Create a New user 
export const createUserService = async (input: Prisma.UserCreateInput) => {
    return (await prisma.user.create({
        data: input,
    })) as User;
};

// Return a unique user based on the unique contraints on the schema eg. Email
export const findUniqueUserService = async (
    where: Prisma.UserWhereUniqueInput,
    select?: Prisma.UserSelect
    ) => {
    return (await prisma.user.findUnique({
        where,
        select,
    })) as User;
};

// Return the first instance of the User
export const findUserService = async (
    where: Partial<Prisma.UserWhereInput>,
    select?: Prisma.UserSelect
    ) => {
        return (await prisma.user.findFirst({
        where,
        select,
    })) as User;
};

// Update the User Table based on data provided.
export const updateUserService = async (
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
    select?: Prisma.UserSelect,
    ) => {
        return (await prisma.user.update({ where, data, select})) as User;
};

// Return all users in the DB
export const getAllUsersService = async (
    ) => {
        return (await prisma.user.findMany());
}

// Generate an Access and Refresh token.
export const signTokens = async (user: Prisma.UserCreateInput) => {
    // 1. Create Session
    redisClient.set(`${user.id}`, JSON.stringify(user),{
        EX: config.get<number>('redisCacheExpiresIn') * 60,
    });

    // 2. Create access and refresh Tokens.
    const access_token = signJwt({ sub: user.id }, "accessTokenPrivateKey", {
        expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
    });

    const refresh_token = signJwt({ sub: user.id }, 'refreshTokenPrivateKey', {
        expiresIn: `${config.get<number>('refreshTokenExpiresIn')}m`,
    });

    return {access_token, refresh_token};
}

// Add a user to the Delete Table
export const createDeleteService = async (input: Prisma.DeletedUserCreateInput) => {
    return (await prisma.deletedUser.create({
        data: input,
    })) as DeletedUser;
};

// Delete User from the Users Table
export const deleteUserService = async (input: Prisma.UserWhereUniqueInput) => {
    return (await prisma.user.delete({
        where: input,
    })) as User;
};

