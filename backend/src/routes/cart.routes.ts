import { Router } from 'express'
import {
  addCartItemController,
  clearCartController,
  getCartController,
  refreshCartController,
  removeCartItemController,
  updateCartItemQuantityController
} from '~/controllers/cart.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import {
  addCartItemValidator,
  removeCartItemValidator,
  updateCartItemQuantityValidator
} from '~/middlewares/cart.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const cartRouter = Router()

cartRouter.get('/', accessTokenValidator, wrapRequestHandler(getCartController))
cartRouter.post('/items', accessTokenValidator, addCartItemValidator, wrapRequestHandler(addCartItemController))
cartRouter.patch(
  '/items/:itemId',
  accessTokenValidator,
  updateCartItemQuantityValidator,
  wrapRequestHandler(updateCartItemQuantityController)
)
cartRouter.delete(
  '/items/:itemId',
  accessTokenValidator,
  removeCartItemValidator,
  wrapRequestHandler(removeCartItemController)
)
cartRouter.delete('/', accessTokenValidator, wrapRequestHandler(clearCartController))
cartRouter.post('/refresh', accessTokenValidator, wrapRequestHandler(refreshCartController))

export default cartRouter
