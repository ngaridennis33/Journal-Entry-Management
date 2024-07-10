import express from 'express'
import { requireUser } from '../middleware/require';
import {getMeHandler } from '../controllers/user.controller';
import { deserializeUser } from '../middleware/deserializeUser';



const router = express.Router();

router.use(deserializeUser,requireUser);

router.get('/me', getMeHandler);

export default router;