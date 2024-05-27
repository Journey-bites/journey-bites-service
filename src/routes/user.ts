import { Router } from 'express';
import { z } from 'zod';

import userController from '@/controllers/userController';
import validateData from '@/middlewares/validateData';

const router = Router();

const updateUserRequestSchema = z.object({
  displayName: z.string().max(50),
  avatarImageUrl: z.string().optional(),
  bio: z.string().optional(),
  socialLinks: z
    .object({
      website: z.string().url().optional(),
      instagram: z.string().url().optional(),
      facebook: z.string().url().optional(),
    })
    .optional(),
});

router.get(
  '/',
  /* 
    #swagger.security = [{'Bearer': []}]
    #swagger.tags = ['User']
    #swagger.description = 'Get user profile information.'
    #swagger.responses[200] = {
      description: 'User profile information',
      schema: {
        statusCode: 0,
        message: 'success',
        data: {
          email: "journey-bites@gmail.com",
          emailVerified: true,
          profile: {
            displayName: "Journey",
            avatarImageUrl: "https://journey-bites.com/avatar.jpg",
            bio: "Travel blogger",
            socialLinks: {
              website: "https://journey-bites.com",
              instagram: "https://instagram.com/journey-bites",
              facebook: "https://facebook.com/journey-bites"
            }
          },
          billing: {
            bankCode: null,
            bankAccount: null,
            bankAccountOwner: null
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'User not found',
      schema: { statusCode: 1001, message: 'User not found' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while getting user info' }
    }
  */
  userController.getUserInfo
);

router.patch(
  '/',
  /* 
    #swagger.security = [{'Bearer': []}]
    #swagger.tags = ['User']
    #swagger.description = 'Update user profile information.'
    #swagger.parameters['payload'] = {
      in: 'body',
      description: 'User profile',
      required: true,
      schema: {
        displayName: 'Journey Bites',
        avatarImageUrl: 'https://journey-bites.com/avatar.jpg',
        bio: 'Travel blogger',
        socialLinks: {
          website: 'https://journey-bites.com',
          instagram: 'https://instagram.com/journey-bites',
          facebook: 'https://facebook.com/journey-bites',
        }
      }
    }
    #swagger.responses[201] = {
      description: 'User profile updated successfully',
      schema: { statusCode: 0, message: 'User profile updated successfully' }
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1003, message: 'Invalid field' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while updating user profile' }
    }
  */
  validateData(updateUserRequestSchema),
  userController.updateUserProfile
);

export default router;
