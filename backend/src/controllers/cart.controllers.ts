import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { AddCartItemReqBody, UpdateCartItemReqBody } from '~/models/requests/CartOrder.request'
import { TokenPayload } from '~/models/requests/User.request'
import cartService from '~/services/cart.services'

export const getCartController = async (req: Request, res: Response) => {
  const decoded = (req as unknown as { decoded_authorization: TokenPayload }).decoded_authorization
  const result = await cartService.buildCartSummary(decoded.user_id)

  return res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.CART_RETRIEVED_SUCCESS,
    result
  })
}

export const addCartItemController = async (
  req: Request<ParamsDictionary, Record<string, never>, AddCartItemReqBody>,
  res: Response
) => {
  const decoded = (req as unknown as { decoded_authorization: TokenPayload }).decoded_authorization
  const result = await cartService.addItem(decoded.user_id, req.body)

  return res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.CART_ITEM_ADDED_SUCCESS,
    result
  })
}

export const updateCartItemQuantityController = async (
  req: Request<{ itemId: string }, Record<string, never>, UpdateCartItemReqBody, { itemType: 'Food' | 'PTService' }>,
  res: Response
) => {
  const decoded = (req as unknown as { decoded_authorization: TokenPayload }).decoded_authorization

  const result = await cartService.updateItemQuantity(decoded.user_id, {
    itemId: req.params.itemId,
    itemType: req.query.itemType,
    quantity: req.body.quantity
  })

  return res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.CART_ITEM_UPDATED_SUCCESS,
    result
  })
}

export const removeCartItemController = async (
  req: Request<{ itemId: string }, Record<string, never>, Record<string, never>, { itemType: 'Food' | 'PTService' }>,
  res: Response
) => {
  const decoded = (req as unknown as { decoded_authorization: TokenPayload }).decoded_authorization

  const result = await cartService.removeItem(decoded.user_id, req.query.itemType, req.params.itemId)

  return res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.CART_ITEM_REMOVED_SUCCESS,
    result
  })
}

export const clearCartController = async (req: Request, res: Response) => {
  const decoded = (req as unknown as { decoded_authorization: TokenPayload }).decoded_authorization
  const result = await cartService.clearCart(decoded.user_id)

  return res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.CART_CLEARED_SUCCESS,
    result
  })
}

export const refreshCartController = async (req: Request, res: Response) => {
  const decoded = (req as unknown as { decoded_authorization: TokenPayload }).decoded_authorization
  const result = await cartService.refreshCart(decoded.user_id)

  return res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.CART_REFRESHED_SUCCESS,
    result
  })
}
