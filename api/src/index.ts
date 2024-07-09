require('dotenv').config();
import { PrismaClient } from '@prisma/client';
import express, { NextFunction, Request, Response } from "express";
import config from 'config';
import http from "http";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import log from "./utils/logger";
import AuthRouter from "./routes/auth.routes";
import UserRouter from "./routes/user.routes";
import validateEnv from './utils/validateEnv';
import AppError from './utils/appError';

const app = express();
const prisma = new PrismaClient();

validateEnv();

async function bootstrap(){
    // 1. Body Parser
    app.use(express.json())

    // 2. Cookie parser
    app.use(cookieParser());

    // 3. Cors
    app.use(cors({
        origin:"http://localhost:3000",
        credentials: true,
    }))

    // 4. Compression
    app.use(compression());

    // 5. Logger

    //TEMPLATE ENGINE
    app.set('view engine', 'pug');
    app.set('views', `${__dirname}/views`);


    // ROUTES
    app.use('/api/auth', AuthRouter);
    app.use('/api/users', UserRouter);

    // 6. Testing
    app.get('/api/healthchecker', (_, res: Response) => {
        res.status(200).json({
        status: 'success',
        message: 'Welcome to NodeJs with Prisma and PostgreSQL',
        });
    });

    // 7. Error Handling
    app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
        const statusCode= err.statusCode;
        const errorMessage = err.message;
    
        return res.status(statusCode).json({statusCode:statusCode, status:err.status, errorMessage});
    });


    // UNHANDLED ROUTES
    app.all("*", (req: Request, res: Response) => {
        res.status(404).json({ error: `Route ${req.originalUrl} not found` });
        });

    // PORT
    const port = config.get<number>('port');
    const origin = config.get<string>('origin');
    const server = http.createServer(app);
    server.listen(port, () => {
        log.info(`Server listening at ${origin}:${port}`);
    });
}

bootstrap()
.catch((err) => {
    throw err;
})
.finally(async () => {
    await prisma.$disconnect();
});