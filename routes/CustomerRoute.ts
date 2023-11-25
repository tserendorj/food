import express, { Request, Response, NextFunction } from 'express';
import { CustomerLogin, CustomerSignUp, CustomerVerify } from '../controllers';
import { Authenticate } from '../middlewares';

const router = express.Router();

// Signup / Create Customer
router.post('/signup', CustomerSignUp)

// Login
router.post('/login', CustomerLogin)

// authentication
router.use(Authenticate)
// Verify Customer Account
router.patch('/verify', CustomerVerify)

// OTP/ Requesting OTP
router.get('/otp')

// Profile
router.get('/profile')

router.patch('/profile')

// Cart

// Order

// Payment




export {router as CustomerRoute}