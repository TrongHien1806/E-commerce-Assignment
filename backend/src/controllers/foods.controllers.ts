import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import foodService from '~/services/foods.services'
import { FoodType } from '~/models/schemas/Food.schema'

type FoodParams = {
  food_id: string
}

type FoodListQuery = {
  page?: string
  limit?: string
}

export const getFoodsController = async (req: Request<ParamsDictionary, any, any, FoodListQuery>, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.max(1, Number(req.query.limit) || 10)

  const result = await foodService.getFoods(page, limit)

  return res.status(HTTP_STATUS.OK).json({
    message: 'Lấy danh sách món ăn thành công',
    result
  })
}

export const getFoodDetailController = async (req: Request<FoodParams>, res: Response) => {
  const result = await foodService.getFoodById(req.params.food_id)

  return res.status(HTTP_STATUS.OK).json({
    message: 'Lấy chi tiết món ăn thành công',
    result
  })
}

export const createFoodController = async (req: Request<ParamsDictionary, any, FoodType>, res: Response) => {
  const result = await foodService.createFood(req.body)

  return res.status(HTTP_STATUS.CREATED).json({
    message: 'Tạo món ăn thành công',
    result
  })
}
