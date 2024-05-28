import { Router, Request, Response } from 'express';
import userController from '@/controllers/userController';
import { createResponse } from '@/utils/http';

const router = Router();

router.get(
  '/',
  // #swagger.security = [{'Bearer': []}]
  userController.getUserInfo
);

export default router;
