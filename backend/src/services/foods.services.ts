import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import Food, { FoodType } from '~/models/schemas/Food.schema'
import databaseService from './database.services'

class FoodService {
  async getFoods(page: number, limit: number) {
    const safePage = Math.max(1, Number(page) || 1)
    const safeLimit = Math.max(1, Number(limit) || 10)
    const skip = (safePage - 1) * safeLimit

    const filter = { isActive: true }

    const [foods, total] = await Promise.all([
      databaseService.foods.find(filter).skip(skip).limit(safeLimit).sort({ createdAt: -1 }).toArray(),
      databaseService.foods.countDocuments(filter)
    ])

    return {
      foods,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        total_pages: Math.ceil(total / safeLimit)
      }
    }
  }

  async getFoodById(food_id: string) {
    if (!ObjectId.isValid(food_id)) {
      throw new ErrorWithStatus({
        message: 'Food ID không hợp lệ',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const food = await databaseService.foods.findOne({
      _id: new ObjectId(food_id),
      isActive: true
    })

    if (!food) {
      throw new ErrorWithStatus({
        message: 'Không tìm thấy món ăn',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return food
  }

  async createFood(payload: FoodType) {
    const food = new Food({
      name: payload.name.trim(),
      description: payload.description.trim(),
      images: payload.images,
      price: payload.price,
      calories: payload.calories,
      nutrition: {
        protein: payload.nutrition.protein,
        carb: payload.nutrition.carb,
        fat: payload.nutrition.fat
      },
      ingredients: payload.ingredients.map((ingredient) => ({
        name: ingredient.name.trim(),
        allergyTags: ingredient.allergyTags
      })),
      tags: payload.tags,
      stock: payload.stock,
      isActive: payload.isActive ?? true
    })

    const result = await databaseService.foods.insertOne(food)

    return {
      _id: result.insertedId,
      ...food
    }
  }
}

const foodService = new FoodService()
export default foodService
