import { Router } from 'express';
import hotArticleController from '@/controllers/hotArticleController';

const router = Router();

router.get(
  '/',
  // #swagger.security = [{'Bearer': []}]
  hotArticleController.getHotArticleInfo
);

export default router;
