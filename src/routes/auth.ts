import { Router } from 'express';
import { z } from 'zod';

import { passwordSchema } from '@/constants/schema';
import authController from '@/controllers/authController';
import validateData from '@/middlewares/validateData';
import authenticate from '@/middlewares/authenticate';
import passport from 'passport';

const registerSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  displayName: z.string().max(50),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

const checkEmailSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  password: passwordSchema,
});

const router = Router();

router.post(
  '/register',
  /* 
    #swagger.tags = ['Auth']
    #swagger.description = 'Register a new user with email, password, and display name.'
    #swagger.parameters['payload'] = {
      in: 'body',
      description: 'User information',
      required: true,
      schema: {
        email: 'journey-bites@gmail.com',
        password: 'test1234',
        displayName: 'Journey Bites'
      }
    }
    #swagger.responses[201] = {
      description: 'User created successfully',
      schema: { statusCode: 0, message: 'User created successfully' }
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1003, message: 'Invalid field' }
    }
    #swagger.responses[400] = {
      description: 'User already exists',
      schema: { statusCode: 2002, message: 'User already exists' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while registering new user' }
    }
  */
  validateData(registerSchema),
  authController.register
);
router.post(
  '/login',
  /* 
    #swagger.tags = ['Auth']
    #swagger.description = 'Login with email and password.'
    #swagger.parameters['payload'] = {
      in: 'body',
      description: 'User information',
      required: true,
      schema: {
        email: 'journey-bites@gmail.com',
        password: 'test1234',
      }
    }
    #swagger.responses[200] = {
      description: 'Login successful',
      schema: { statusCode: 0, message: 'User created successfully', data: { token: '6a431b030bfcb67e98ff0eaafbe43c3ed0addc7809cfc946' } }
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1003, message: 'Invalid field' }
    }
    #swagger.responses[401] = {
      description: 'User not found or wrong password',
      schema: { statusCode: 2008, message: 'User not found or wrong password' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while logging in' }
    }
  */
  validateData(loginSchema),
  authController.login
);
router.post(
  '/verify-email',
  /* 
    #swagger.tags = ['Auth']
    #swagger.description = 'Verify email.'
    #swagger.parameters['payload'] = {
      in: 'body',
      description: 'User information',
      required: true,
      schema: {
        email: 'journey-bites@gmail.com',
      }
    }
    #swagger.responses[200] = {
      description: 'Email is available',
      schema: { statusCode: 0, message: 'Email is available"' }
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1003, message: 'Invalid field' }
    }
    #swagger.responses[400] = {
      description: 'User already exists',
      schema: { statusCode: 2002, message: 'User already exists' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while verifying email' }
    }
  */
  validateData(checkEmailSchema),
  authController.verifyEmail
);

// need to be authenticated to access these routes
router.post(
  '/logout',
  /* 
    #swagger.tags = ['Auth']
    #swagger.description = 'Logout.'
    #swagger.security = [{'Bearer': []}]
    #swagger.responses[204] = {
      description: 'Logout successful',
    }
    #swagger.responses[401] = {
      description: 'Token is invalid',
      schema: { statusCode: 2003, message: 'Token is invalid'}
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while logging out' }
    }
  */
  authenticate,
  authController.logout
);
router.patch(
  '/reset-password',
  /* 
    #swagger.tags = ['Auth']
    #swagger.description = 'Reset password.'
    #swagger.security = [{'Bearer': []}]
    #swagger.parameters['payload'] = {
      in: 'body',
      description: 'New password',
      required: true,
      schema: {
        password: 'test5678',
      }
    }
    #swagger.responses[200] = {
      description: 'Email is available',
      schema: { statusCode: 0, message: 'Password updated successfully' }
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1003, message: 'Invalid field' }
    }
    #swagger.responses[401] = {
      description: 'Token is invalid',
      schema: { statusCode: 2003, message: 'Token is invalid'}
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while verifying email' }
    }
  */
  authenticate,
  validateData(resetPasswordSchema),
  authController.resetPassword
);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  authController.authorizationCallback
);

export default router;
