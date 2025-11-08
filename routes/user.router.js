import { Router } from 'express'

import { addUser, getAllUsers, deleteUser, getUsersById } from "../controllers/user.controller.js";

const router = Router();
router.post('/', addUser);
router.get('/', getAllUsers);
router.get('/:id', getUsersById);
router.delete('/:id', deleteUser);

export default router;