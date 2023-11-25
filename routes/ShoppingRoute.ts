import express, { Request, Response, NextFunction } from 'express';
import {GetFoodAvailability, GetTopRestaurants, GetFoodsIn30Min, SearchFoods, RestaurantById} from '../controllers';


const router = express.Router();

// Food Availability
router.get('/:pincode', GetFoodAvailability)
// Top Restaurants
router.get('/top-restaurants/:pincode', GetTopRestaurants)
// Foods Available in 30 minutes
router.get('/foods-in-30-min/:pincode', GetFoodsIn30Min)
// Search Foods
router.get('/search/:pincode', SearchFoods)
// Find Restaurant By ID
router.get('/restaurant/:id', RestaurantById)


export {router as ShoppingRoute}