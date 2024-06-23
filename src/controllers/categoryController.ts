import { Request, Response, NextFunction } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import { SystemException } from '@/exceptions/SystemException';
import categoryService from '@/services/categoryServices';
import { CategoryRequest } from '@/validateSchema/categoryRequest';
import { createResponse } from '@/utils/http';
import asyncHandler from '@/utils/asyncHandler';

interface AddCategoryRequest extends Request {
  body: CategoryRequest;
}

const categoryController = {
  addCategory: asyncHandler(async (req: AddCategoryRequest, res: Response, next: NextFunction) => {
    const { name, path } = req.body;
    try {
      await categoryService.addCategory(name, path, req.body.description);

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
};

export default categoryController;
