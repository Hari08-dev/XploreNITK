import express from 'express'
import { aiSearch } from '../controllers/ai.controller.js'
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.use(isAuth);

router.post('/', aiSearch);

export default router;