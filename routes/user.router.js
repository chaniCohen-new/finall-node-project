import { Router } from 'express'
import { validateBody } from '../middlewares/validate.middleware.js'; 
import { userJoi } from '../models/user.model.js';
import {auth} from '../middlewares/auth.middleware.js';

import { addUser, getAllUsers, deleteUser, getUsersById, updateUser } from "../controllers/user.controller.js";

const router = Router();
router.post('/', validateBody(userJoi.register), addUser);
router.get('/',  getAllUsers);
router.get('/:id', getUsersById);
router.put('/', updateUser)
router.delete('/:id', deleteUser);

export default router;