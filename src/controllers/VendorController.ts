import { Request, Response, NextFunction } from "express";
import { EditVendorInputs, VendorLoginInputs } from "../dto";
import { FindVendor } from "./AdminController";
import { GeneratePassword, GenerateSignature, ValidatePassword } from "../utility";
import { CreateFoodInputs } from "../dto/Food.dto";
import { Food } from "../models/Food";

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

export const UpdateVendorCoverImage = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if(user){

        const vendor = await FindVendor(user._id);

        if (vendor !== null){


            const files = req.files as [Express.Multer.File]


            const images = files.map((file: Express.Multer.File) => file.filename);

            vendor.coverImages.push(...images);

            const result = await vendor.save();
            return res.json(result);
        }


    }

    return res.json({"message": "Something went wrong with add food"})
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


export const AddFood = async (req: Request, res: Response, next: NextFunction) => {
    
    const user = req.user;

    if(user){
        const {name, description, category, foodType, readyTime, price} = <CreateFoodInputs>req.body;

        const vendor = await FindVendor(user._id);

        if (vendor !== null){


            const files = req.files as [Express.Multer.File]


            const images = files.map((file: Express.Multer.File) => file.filename);

            const createdFood = await Food.create({
                vendorId: vendor._id,
                name: name,
                description: description, 
                category: category,
                foodType: foodType,
                images: images,
                readyTime: readyTime,
                price: price,
                rating: 0
            })

            vendor.foods.push(createdFood);
            const result = await vendor.save();
            return res.json(result);
        }


    }

    return res.json({"message": "Something went wrong with add food"})

}

export const GetFoods = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if(user){

        const foods = await Food.find({vendorId: user._id})

        if (foods !== null){
            return res.json(foods)
        }
    }

    return res.json({"message": "Foods Not Found"})

}

export const GetCurrentOrders = async (req: Request, res: Response, next: NextFunction) => {

}

export const GetOrderDetails = async (req: Request, res: Response, next: NextFunction) => {

}

export const ProcessOrder = async (req: Request, res: Response, next: NextFunction) => {

}

