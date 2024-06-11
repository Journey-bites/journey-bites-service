import { Router } from 'express';
import articleController from '@/controllers/postArticleInfo';
import authenticate from '@/middlewares/authenticate';

const router = Router();

router.post('/', authenticate, articleController.postArticleInfo);

export default router;
