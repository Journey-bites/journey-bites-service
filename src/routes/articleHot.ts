import { Router } from 'express';
import articleHotController from '@/controllers/articleHotController';

const router = Router();

router.get(
  '/',
  // #swagger.security = [{'Bearer': []}]
  articleHotController.getArticleHotInfo
);

export default router;
