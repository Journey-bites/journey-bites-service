import db from '@/db';
import { Prisma } from '@prisma/client';

import { PrismaClientErrorCode } from '@/types/PrismaClientErrorCode';
import { generateOrderNo } from '@/utils/comm';
import { NewebpayReturnData } from '@/utils/newebpay';

const getOrderByUserIdAndOrderNo = async (userId: string, orderNo: string) => {
  try {
    const order = await db.order.findUnique({
      where: {
        orderNo,
        userId,
      },
    });

    return order;
  } catch (error) {
    throw new Error('Error while getting order');
  }
};

const createOrder = async (userId: string, sellerId: string) => {
  try {
    const orderNo = generateOrderNo();

    const newOrder = await db.order.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        orderNo,
        sellerId,
      },
    });

    return newOrder;
  } catch (error) {
    throw new Error('Error while creating a new order');
  }
};

const updateOrder = async (orderNo: string, payload: NewebpayReturnData) => {
  try {
    const order = await db.order.findUnique({
      where: {
        orderNo,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const result = await db.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: 'SUCCESS',
        payment: {
          create: {
            amount: payload.Amt,
            transactionId: payload.TradeNo,
            paymentIP: payload.IP,
            escrowBank: payload.EscrowBank,
            paymentType: payload.PaymentType,
            account5Code: payload.PayerAccount5Code,
            payBankCode: payload.PayBankCode,
          },
        },
        subscription: {
          create: {
            subscribedTo: {
              connect: {
                id: order.sellerId,
              },
            },
            subscriber: {
              connect: {
                id: order.userId,
              },
            },
          },
        },
      },
    });

    return result;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PrismaClientErrorCode.OperationFailedError
    ) {
      return false;
    }

    throw new Error('Error while updating order');
  }
};

export default {
  getOrderByUserIdAndOrderNo,
  createOrder,
  updateOrder,
};
