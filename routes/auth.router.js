import { Router } from 'express';
import { validateBody } from '../middlewares/validate.middleware.js'; 
import { userJoi } from '../models/user.model.js'; 

import { register, login } from '../controllers/userAuth.controller.js'
const router = Router();

router.post('/register', validateBody(userJoi.register), register);

router.post('/login', validateBody(userJoi.login), login);

export default router;