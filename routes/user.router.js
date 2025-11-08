import { Router } from 'express'
import { validateBody } from '../middlewares/validate.middleware.js'; 
import { userJoi } from '../models/user.model.js';

import { addUser, getAllUsers, deleteUser, getUsersById } from "../controllers/user.controller.js";

const router = Router();
router.post('/', validateBody(userJoi.register), addUser);
router.get('/', getAllUsers);
router.get('/:id', getUsersById);
router.delete('/:id', deleteUser);

export default router;