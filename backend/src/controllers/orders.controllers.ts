import { Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { TokenPayload } from '~/models/requests/User.request'
import ordersService from '~/services/orders.services'

export const createOrderController = async (req: Request, res: Response) => {
  const decoded_authorization = (req as unknown as { decoded_authorization: TokenPayload }).decoded_authorization

  const result = await ordersService.createOrder(decoded_authorization.user_id, req.body)

  return res.status(HTTP_STATUS.CREATED).json({
    message: 'Đặt hàng thành công',
    result
  })
}

export const getMyOrdersController = async (req: Request, res: Response) => {
  const decoded_authorization = (req as unknown as { decoded_authorization: TokenPayload }).decoded_authorization

  const result = await ordersService.getUserOrders(decoded_authorization.user_id)

  return res.status(HTTP_STATUS.OK).json({
    message: 'Lấy lịch sử đơn hàng thành công',
    result
  })
}
