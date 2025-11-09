import { Router } from 'express'
import { validateBody } from '../middlewares/validate.middleware.js'; 
import { userJoi } from '../models/user.model.js';
import {auth} from '../middlewares/auth.middleware.js';

import { addUser, getAllUsers, deleteUser, getUsersById } from "../controllers/user.controller.js";

const router = Router();
router.post('/', auth, validateBody(userJoi.register), addUser);
router.get('/', auth,  getAllUsers);
router.get('/:id', auth, getUsersById);
router.delete('/:id', auth, deleteUser);

export default router;