import express, {Request, Response, NextFunction} from 'express';
import {validate} from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateCustomerInputs } from '../dto/Customer.dto';
import { GenerateOtp, GeneratePassword, GenerateSalt, GenerateSignature, onRequestOTP } from '../utility';
import { Customer } from '../models/Customer';

export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {
    const customerInputs = plainToClass(CreateCustomerInputs, req.body)

    const inputErrors = await validate(customerInputs, {validationError: {target: true}});

    if (inputErrors.length > 0 ){
        return res.status(400).json(inputErrors);
    }

    const {email, phone, password } = customerInputs;

    const salt = await GenerateSalt()
    const userPassword = await GeneratePassword(password,salt)

    const {otp, expiry} = GenerateOtp();

    const existCustomer = await Customer.findOne({email: email})

    if(existCustomer !== null){
        return res.status(409).json({message: 'User exist with provided id'})
    }
    
    const result = await Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lat: 0,
        lng: 0
    })

    if(result) {
        // send OTP to customer
        // await onRequestOTP(otp, phone)
        // generate the signature
        const signature = GenerateSignature({
            _id: result._id,
            email: result.email,
            verified: result.verified
        })
        // send the result to client
        return res.status(201).json({signature: signature, verified: result.verified, email: result.email});

    }

    return res.status(400).json({message: "errors with signup"})



}

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {

}

export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) => {
    const {otp} = req.body;

    const customer = req.user;

    if(customer){
        const profile = await Customer.findById(customer._id)
        if (profile) {
            if(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()){
                profile.verified = true;

                const updatedCustomerResponse = await profile.save();

                // generate the signature

                const signature = GenerateSignature({
                    _id: updatedCustomerResponse._id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                });

                return res.status(201).json({
                    signature: signature,
                    verified: updatedCustomerResponse.verified,
                    email: updatedCustomerResponse.email
                })

            }
        }
    }
    return res.status(400).json({message: "error with verification"})

}

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {

}

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {

}

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {

}