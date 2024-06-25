import { Request, Response, NextFunction } from 'express';

import ErrorCode from '@/exceptions/ErrorCode';
import { HttpException } from '@/exceptions/HttpException';
import { SystemException } from '@/exceptions/SystemException';
import categoryService from '@/services/categoryService';
import { CategoryRequest } from '@/validateSchema/categoryRequest';
import asyncHandler from '@/utils/asyncHandler';
import { createResponse } from '@/utils/http';

interface AddCategoryRequest extends Request {
  body: CategoryRequest;
}

const categoryController = {
  addCategory: asyncHandler(async (req: AddCategoryRequest, res: Response, next: NextFunction) => {
    const { name, path, description } = req.body;
    try {
      const result = await categoryService.createCategory(name, path, description);

      if (!result) {
        throw new HttpException({
          httpCode: 400,
          errorCode: ErrorCode.ILLEGAL_PAYLOAD,
          message: 'Category name already exists',
        });
      }

      return createResponse(res, {
        httpCode: 201,
        message: 'Category added successfully',
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }
      next(new SystemException('Error while adding category'));
    }
  }),
  getCategory: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await categoryService.getCategories();

      return createResponse(res, {
        message: 'Getting Categories successfully',
        data: categories,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }
      next(new SystemException('Error while getting categories'));
    }
  }),
};

export default categoryController;
