import { Router } from 'express'
import { createOrderController, getMyOrdersController } from '~/controllers/orders.controllers'
import { createOrderValidator } from '~/middlewares/orders.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const ordersRouter = Router()

// Yêu cầu user đã đăng nhập
ordersRouter.use(accessTokenValidator)

// [POST] /orders - Tạo đơn hàng
ordersRouter.post('/', createOrderValidator, wrapRequestHandler(createOrderController))

// [GET] /orders/me - Lấy lịch sử mua hàng của user đang đăng nhập
ordersRouter.get('/me', wrapRequestHandler(getMyOrdersController))

export default ordersRouter
