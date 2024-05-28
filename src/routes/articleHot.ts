import { Router } from 'express';
// import userController from '@/controllers/userController';
import articleHotController from '@/controllers/articleHotController';

const router = Router();

router.get(
  '/',
  // #swagger.security = [{'Bearer': []}]
  articleHotController.getArticleHotInfo
);

export default router;
