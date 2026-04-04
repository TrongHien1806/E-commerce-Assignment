import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from './database.services'
import Order, { PaymentMethod, PaymentStatus } from '~/models/schemas/Order.schema'

type CreateOrderItemPayload = {
  itemType: 'Food' | 'PTService'
  itemId: string
  quantity: number
}

type CreateOrderPayload = {
  items: CreateOrderItemPayload[]
  deliveryAddress: string
  note?: string
  payment: {
    method: PaymentMethod
  }
}

class OrdersService {
  async createOrder(user_id: string, payload: CreateOrderPayload) {
    if (!ObjectId.isValid(user_id)) {
      throw new ErrorWithStatus({
        message: 'User ID không hợp lệ',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const normalizedItems = await Promise.all(
      payload.items.map(async (item) => {
        if (!ObjectId.isValid(item.itemId)) {
          throw new ErrorWithStatus({
            message: 'ID sản phẩm không hợp lệ',
            status: HTTP_STATUS.BAD_REQUEST
          })
        }

        const objectItemId = new ObjectId(item.itemId)

        if (item.itemType === 'Food') {
          const food = await databaseService.foods.findOne({
            _id: objectItemId,
            isActive: true
          })

          if (!food) {
            throw new ErrorWithStatus({
              message: 'Không tìm thấy món ăn',
              status: HTTP_STATUS.NOT_FOUND
            })
          }

          if (food.stock < item.quantity) {
            throw new ErrorWithStatus({
              message: `Món "${food.name}" không đủ số lượng trong kho`,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }

          return {
            itemType: item.itemType,
            itemId: objectItemId,
            quantity: item.quantity,
            price: food.price
          }
        }

        const ptService = await databaseService.ptServices.findOne({
          _id: objectItemId,
          isActive: true
        })

        if (!ptService) {
          throw new ErrorWithStatus({
            message: 'Không tìm thấy gói PT',
            status: HTTP_STATUS.NOT_FOUND
          })
        }

        return {
          itemType: item.itemType,
          itemId: objectItemId,
          quantity: item.quantity,
          price: ptService.price
        }
      })
    )

    const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Tạm thời hard-code, sau này thay bằng logic tính phí ship thực tế
    const shippingFee = normalizedItems.some((item) => item.itemType === 'Food') ? 20000 : 0
    const grandTotal = subtotal + shippingFee

    const paymentStatus: PaymentStatus = 'Pending'

    const newOrder = new Order({
      userId: new ObjectId(user_id),
      items: normalizedItems,
      subtotal,
      shippingFee,
      grandTotal,
      status: 'Pending',
      deliveryAddress: payload.deliveryAddress.trim(),
      note: payload.note?.trim() || '',
      payment: {
        method: payload.payment.method,
        status: paymentStatus
      }
    })

    const result = await databaseService.orders.insertOne(newOrder)

    return databaseService.orders.findOne({ _id: result.insertedId })
  }

  async getUserOrders(user_id: string) {
    if (!ObjectId.isValid(user_id)) {
      throw new ErrorWithStatus({
        message: 'User ID không hợp lệ',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    return databaseService.orders
      .find({ userId: new ObjectId(user_id) })
      .sort({ createdAt: -1 })
      .toArray()
  }
}

const ordersService = new OrdersService()
export default ordersService
