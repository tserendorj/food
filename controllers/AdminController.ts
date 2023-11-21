import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";

export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {
    const {name, address, pincode, foodType, email, password, ownerName, phone} = <CreateVendorInput>req.body;
    
    const existingVendor = await Vendor.findOne({email: email})

    if (existingVendor !== null){
        return res.json({"message": "A vendor is exist with this email ID"})
    }

    // generate salt
    // encrypt the password using the salt

    const CreateVendor = await Vendor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodType: foodType,
        email: email,
        password: password,
        salt: 'fgdgfdg',
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: false,
        coverImages: []
    })

    return res.json(CreateVendor)
}
export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {

}
export const GetVendorByID = async (req: Request, res: Response, next: NextFunction) => {

}