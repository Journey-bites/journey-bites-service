import { Request, Response, NextFunction } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import { ResourceNotFoundException } from '@/exceptions/ResourceNotFoundException';
import { SystemException } from '@/exceptions/SystemException';
import orderService from '@/services/orderService';
import asyncHandler from '@/utils/asyncHandler';
import { createResponse } from '@/utils/http';
import { createMpgAesDecrypt } from '@/utils/newebpay';

const orderController = {
  getOrders: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;

    try {
      const orders = await orderService.getOrders(userId);

      const data = orders.map((order) => {
        const { status, ...rest } = order;
        const isSuccess = status === 'SUCCESS';

        return { ...rest, isSuccess };
      });

      return createResponse(res, {
        data,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while getting orders');
    }
  }),
  getOrder: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const { orderNo } = req.params;

    try {
      const order = await orderService.getOrderByUserIdAndOrderNo(userId, orderNo);

      if (!order) {
        throw new ResourceNotFoundException('Order not found');
      }

      return createResponse(res, {
        data: order,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while getting order');
    }
  }),
  newebpayNotify: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { TradeInfo } = req.body;

    try {
      const orderInfo = createMpgAesDecrypt(TradeInfo);

      if (orderInfo.Status !== 'SUCCESS') {
        throw new SystemException('Error while creating order for subscription');
      }

      await orderService.updateOrder(orderInfo.Result.MerchantOrderNo, orderInfo.Result);

      return createResponse(res, {
        message: 'Success',
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while create order for subscription');
    }
  }),
  newebpayReturn: (req: Request, res: Response) => {
    const { TradeInfo } = req.body;

    const orderInfo = createMpgAesDecrypt(TradeInfo);

    const orderNo = orderInfo.Result.MerchantOrderNo;
    const isSuccess = orderInfo.Status === 'SUCCESS';

    res.redirect(`${process.env.CLIENT_URL}/manage/orders?orderNo=${orderNo}&success=${isSuccess}`);
  },
};

export default orderController;
