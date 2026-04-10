import { Router } from 'express'
import { createFoodController, getFoodDetailController, getFoodsController } from '~/controllers/foods.controllers'
import { createFoodValidator, getFoodDetailValidator } from '~/middlewares/foods.middlewares'
import { accessTokenValidator, isAdminValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const foodsRouter = Router()

/**
 * Description. Get foods list with optional filtering, sorting and pagination
 * Path: /
 * Method: GET
//  * Query: { page?: number, limit?: number, search?: string, tags?: string, minPrice?: number, maxPrice?: number, minCalories?: number, maxCalories?: number, isCombo?: 'true' | 'false', sortBy?: string, order?: 'asc' | 'desc' }
 */
foodsRouter.get('/', wrapRequestHandler(getFoodsController))

/**
 * Description. Get detail of one food by id
 * Path: /:food_id
 * Method: GET
 * Params: { food_id: string }
 */
foodsRouter.get('/:food_id', getFoodDetailValidator, wrapRequestHandler(getFoodDetailController))

/**
 * Description. Create a new food item
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { name: string, description: string, category: string, price: number, calories: number, protein: number, carbs: number, fat: number, imageUrl?: string, stock?: number, isActive?: boolean }
 */
foodsRouter.post('/', accessTokenValidator, createFoodValidator, wrapRequestHandler(createFoodController))

/**
 * Description. Create a new food item (CHỈ ADMIN MỚI ĐƯỢC TẠO)
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 */
foodsRouter.post(
  '/', 
  accessTokenValidator, 
  isAdminValidator, // Đặt trạm kiểm soát Admin ở đây
  createFoodValidator, 
  wrapRequestHandler(createFoodController)
)

export default foodsRouter
