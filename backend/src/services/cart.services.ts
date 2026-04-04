import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import Cart, { CartItemType } from '~/models/schemas/Cart.schema'
import databaseService from '~/services/database.services'

interface FoodProjection {
  _id: ObjectId
  name: string
  images: string[]
  calories: number
  price: number
  isActive: boolean
  stock: number
}

interface PTServiceProjection {
  _id: ObjectId
  title: string
  price: number
  isActive: boolean
}

export interface CartSummaryItem {
  itemType: CartItemType
  itemId: ObjectId
  quantity: number
  itemName: string
  image: string | null
  unitPrice: number
  unitCalories: number
  lineTotal: number
  lineCalories: number
  availability: {
    isActive: boolean
    inStock: boolean
  }
}

class CartService {
  private async getOrCreateCart(userId: string) {
    const userObjectId = new ObjectId(userId)
    const existing = await databaseService.carts.findOne({ userId: userObjectId })

    if (existing) return existing

    const newCart = new Cart({
      userId: userObjectId,
      items: []
    })

    await databaseService.carts.insertOne(newCart)
    return newCart
  }

  private async getFoodMap(foodIds: ObjectId[]) {
    if (foodIds.length === 0) return new Map<string, FoodProjection>()
    const foods = await databaseService.foods
      .find({ _id: { $in: foodIds } })
      .project({ _id: 1, name: 1, images: 1, calories: 1, price: 1, isActive: 1, stock: 1 })
      .toArray()

    return new Map(foods.map((food) => [String(food._id), food as FoodProjection]))
  }

  private async getPTServiceMap(serviceIds: ObjectId[]) {
    if (serviceIds.length === 0) return new Map<string, PTServiceProjection>()
    const services = await databaseService.ptServices
      .find({ _id: { $in: serviceIds } })
      .project({ _id: 1, title: 1, price: 1, isActive: 1 })
      .toArray()

    return new Map(services.map((service) => [String(service._id), service as PTServiceProjection]))
  }

  async buildCartSummary(userId: string) {
    const cart = await this.getOrCreateCart(userId)

    const foodIds = cart.items.filter((item) => item.itemType === 'Food').map((item) => item.itemId)
    const serviceIds = cart.items.filter((item) => item.itemType === 'PTService').map((item) => item.itemId)

    const [foodMap, serviceMap] = await Promise.all([this.getFoodMap(foodIds), this.getPTServiceMap(serviceIds)])

    const normalizedItems: CartSummaryItem[] = []

    for (const item of cart.items) {
      if (item.itemType === 'Food') {
        const food = foodMap.get(String(item.itemId))
        if (!food) continue

        const unitPrice = Number(food.price || 0)
        const unitCalories = Number(food.calories || 0)
        normalizedItems.push({
          itemType: item.itemType,
          itemId: item.itemId,
          quantity: item.quantity,
          itemName: food.name,
          image: Array.isArray(food.images) ? food.images[0] || null : null,
          unitPrice,
          unitCalories,
          lineTotal: unitPrice * item.quantity,
          lineCalories: unitCalories * item.quantity,
          availability: {
            isActive: Boolean(food.isActive),
            inStock: Number(food.stock || 0) >= item.quantity
          }
        })
        continue
      }

      const service = serviceMap.get(String(item.itemId))
      if (!service) continue

      const unitPrice = Number(service.price || 0)
      normalizedItems.push({
        itemType: item.itemType,
        itemId: item.itemId,
        quantity: item.quantity,
        itemName: service.title,
        image: null,
        unitPrice,
        unitCalories: 0,
        lineTotal: unitPrice * item.quantity,
        lineCalories: 0,
        availability: {
          isActive: Boolean(service.isActive),
          inStock: true
        }
      })
    }

    const summary = normalizedItems.reduce(
      (acc, item) => {
        acc.itemCount += Number(item?.quantity || 0)
        acc.subtotal += Number(item?.lineTotal || 0)
        acc.totalCalories += Number(item?.lineCalories || 0)
        return acc
      },
      {
        itemCount: 0,
        subtotal: 0,
        totalCalories: 0
      }
    )

    return {
      cartId: cart._id,
      userId: cart.userId,
      items: normalizedItems,
      summary
    }
  }

  private async ensurePurchasableItem(itemType: CartItemType, itemId: ObjectId) {
    if (itemType === 'Food') {
      const food = await databaseService.foods.findOne({ _id: itemId })
      if (!food || !food.isActive || food.stock <= 0) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.CART_ITEM_NOT_AVAILABLE,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
      return Number(food.price)
    }

    const ptService = await databaseService.ptServices.findOne({ _id: itemId })
    if (!ptService || !ptService.isActive) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.CART_ITEM_NOT_AVAILABLE,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    return Number(ptService.price)
  }

  async addItem(userId: string, payload: { itemType: CartItemType; itemId: string; quantity: number }) {
    const cart = await this.getOrCreateCart(userId)
    const itemObjectId = new ObjectId(payload.itemId)
    const quantity = payload.quantity

    if (quantity <= 0) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.CART_QUANTITY_MUST_BE_POSITIVE,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const latestPrice = await this.ensurePurchasableItem(payload.itemType, itemObjectId)

    const existing = cart.items.find(
      (item) => item.itemType === payload.itemType && String(item.itemId) === String(itemObjectId)
    )

    if (existing) {
      existing.quantity += quantity
      existing.priceAtOrder = latestPrice
    } else {
      cart.items.push({
        itemType: payload.itemType,
        itemId: itemObjectId,
        quantity,
        priceAtOrder: latestPrice
      })
    }

    await databaseService.carts.updateOne(
      { _id: cart._id },
      {
        $set: {
          items: cart.items
        },
        $currentDate: { updatedAt: true }
      }
    )

    return this.buildCartSummary(userId)
  }

  async updateItemQuantity(userId: string, payload: { itemType: CartItemType; itemId: string; quantity: number }) {
    const cart = await this.getOrCreateCart(userId)
    const itemObjectId = new ObjectId(payload.itemId)
    const target = cart.items.find(
      (item) => item.itemType === payload.itemType && String(item.itemId) === String(itemObjectId)
    )

    if (!target) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.CART_ITEM_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (payload.quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => !(item.itemType === payload.itemType && String(item.itemId) === String(itemObjectId))
      )
    } else {
      const latestPrice = await this.ensurePurchasableItem(payload.itemType, itemObjectId)
      target.quantity = payload.quantity
      target.priceAtOrder = latestPrice
    }

    await databaseService.carts.updateOne(
      { _id: cart._id },
      {
        $set: {
          items: cart.items
        },
        $currentDate: { updatedAt: true }
      }
    )

    return this.buildCartSummary(userId)
  }

  async removeItem(userId: string, itemType: CartItemType, itemId: string) {
    const cart = await this.getOrCreateCart(userId)
    const before = cart.items.length

    cart.items = cart.items.filter((item) => !(item.itemType === itemType && String(item.itemId) === itemId))

    if (before === cart.items.length) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.CART_ITEM_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    await databaseService.carts.updateOne(
      { _id: cart._id },
      {
        $set: {
          items: cart.items
        },
        $currentDate: { updatedAt: true }
      }
    )

    return this.buildCartSummary(userId)
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId)

    await databaseService.carts.updateOne(
      { _id: cart._id },
      {
        $set: {
          items: []
        },
        $currentDate: { updatedAt: true }
      }
    )

    return this.buildCartSummary(userId)
  }

  async refreshCart(userId: string) {
    return this.buildCartSummary(userId)
  }
}

const cartService = new CartService()
export default cartService
