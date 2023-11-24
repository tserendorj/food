import { Request, Response, NextFunction } from "express";
import { EditVendorInputs, VendorLoginInputs } from "../dto";
import { FindVendor } from "./AdminController";
import { GeneratePassword, GenerateSignature, ValidatePassword } from "../utility";

export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = <VendorLoginInputs>req.body;
    
    const existingVendor = await FindVendor("", email);

    if (existingVendor !== null){
        // validation
        const validation = await ValidatePassword(password, existingVendor.password, existingVendor.salt);

        if (validation){
            const signature = GenerateSignature({
                _id: existingVendor.id,
                email: existingVendor.email,
                foodTypes: existingVendor.foodType,
                name: existingVendor.name
            })
            return res.json(signature);
        }else {
            return res.json({"message": "password is not valid"})
        }
    }
    return res.json({'message': 'login credential not valid'})
    
}

export const GetVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
       
        const existingVendor = await FindVendor(user._id);

        return res.json(existingVendor)
    }

    return res.json({"message": "Vendor information not found"})
        
    
}

export const UpdateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {

    const {foodTypes, name, address, phone} = <EditVendorInputs>req.body;

    const user = req.user;
    if (user) {
       
        const existingVendor = await FindVendor(user._id);

        if (existingVendor !== null){
            existingVendor.name = name;
            existingVendor.address = address;
            existingVendor.phone = phone;
            existingVendor.foodType = foodTypes;

            const savedResult = await existingVendor.save()
            return res.json(savedResult);
        }

        return res.json(existingVendor)
    }

    return res.json({"message": "Vendor information not found"})
}

export const UpdateVendorService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
       
        const existingVendor = await FindVendor(user._id);

        if (existingVendor !== null){
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
            const savedResult = await existingVendor.save()
            
            return res.json(savedResult);
        }

        return res.json(existingVendor)
    }

    return res.json({"message": "Vendor information not found"})
}