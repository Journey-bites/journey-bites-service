import { Request, Response, NextFunction } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import { SystemException } from '@/exceptions/SystemException';
import { CategoryRequest } from '@/validateSchema/categoryRequest';
import { createResponse } from '@/utils/http';
import categoryService from '@/services/categoryServices';

interface AddCategoryRequest extends Request {
  body: CategoryRequest;
}

const categoryController = {
  addCategory: async (req: AddCategoryRequest, res: Response, next: NextFunction) => {
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
  },
  getCategory: async (req: AddCategoryRequest, res: Response, next: NextFunction) => {
    try {
      const categories = await categoryService.getCategories();
      return createResponse(res, {
        message: 'Categories fetched successfully',
        data: categories,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }
      next(new SystemException('Error while fetching categories'));
    }
  },
};

export default categoryController;
