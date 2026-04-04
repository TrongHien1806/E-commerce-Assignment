import { checkSchema } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'

export const addCartItemValidator = validate(
  checkSchema(
    {
      itemType: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.CART_ITEM_TYPE_IS_REQUIRED
        },
        isIn: {
          options: [['Food', 'PTService']],
          errorMessage: USERS_MESSAGES.CART_ITEM_TYPE_IS_INVALID
        }
      },
      itemId: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.CART_ITEM_ID_IS_REQUIRED
        },
        isMongoId: {
          errorMessage: USERS_MESSAGES.CART_ITEM_ID_IS_INVALID
        }
      },
      quantity: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.CART_QUANTITY_IS_REQUIRED
        },
        isInt: {
          options: { min: 1 },
          errorMessage: USERS_MESSAGES.CART_QUANTITY_MUST_BE_POSITIVE
        }
      }
    },
    ['body']
  )
)

export const updateCartItemQuantityValidator = validate(
  checkSchema(
    {
      itemId: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.CART_ITEM_ID_IS_REQUIRED
        },
        isMongoId: {
          errorMessage: USERS_MESSAGES.CART_ITEM_ID_IS_INVALID
        }
      },
      itemType: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.CART_ITEM_TYPE_IS_REQUIRED
        },
        isIn: {
          options: [['Food', 'PTService']],
          errorMessage: USERS_MESSAGES.CART_ITEM_TYPE_IS_INVALID
        }
      },
      quantity: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.CART_QUANTITY_IS_REQUIRED
        },
        isInt: {
          options: { min: 0 },
          errorMessage: USERS_MESSAGES.CART_QUANTITY_MUST_BE_ZERO_OR_POSITIVE
        }
      }
    },
    ['params', 'query', 'body']
  )
)

export const removeCartItemValidator = validate(
  checkSchema(
    {
      itemId: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.CART_ITEM_ID_IS_REQUIRED
        },
        isMongoId: {
          errorMessage: USERS_MESSAGES.CART_ITEM_ID_IS_INVALID
        }
      },
      itemType: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.CART_ITEM_TYPE_IS_REQUIRED
        },
        isIn: {
          options: [['Food', 'PTService']],
          errorMessage: USERS_MESSAGES.CART_ITEM_TYPE_IS_INVALID
        }
      }
    },
    ['params', 'query']
  )
)
