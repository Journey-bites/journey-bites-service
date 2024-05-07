import { Router } from 'express';
import userController from '@/controllers/userController';

const router = Router();

router.get(
  '/',
  // #swagger.security = [{'Bearer': []}]
  userController.getUserInfo
);

export default router;
