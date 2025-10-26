import { Router } from 'express'

import { addUser } from "../controllers/user.controller.js";

const router = Router();
router.post('/add', addUser)

export default router;