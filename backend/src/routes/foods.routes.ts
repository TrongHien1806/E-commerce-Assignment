import { Router } from 'express'
import { createFoodController, getFoodDetailController, getFoodsController } from '~/controllers/foods.controllers'
import { createFoodValidator, getFoodDetailValidator } from '~/middlewares/foods.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const foodsRouter = Router()

foodsRouter.get('/', wrapRequestHandler(getFoodsController))
foodsRouter.get('/:food_id', getFoodDetailValidator, wrapRequestHandler(getFoodDetailController))

foodsRouter.post('/', accessTokenValidator, createFoodValidator, wrapRequestHandler(createFoodController))

export default foodsRouter
