import { checkSchema } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'

const PAYMENT_METHODS = ['COD', 'VNPay', 'MoMo']
const DELIVERY_MODES = ['WEEKLY_ONCE', 'DAILY']
const PAYMENT_STATUSES = ['Pending', 'Paid', 'Failed']
const ORDER_NEXT_STATUSES = ['Cooking', 'Delivering', 'Completed']

export const quoteOrderValidator = validate(
  checkSchema(
    {
      deliveryAddress: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.DELIVERY_ADDRESS_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.DELIVERY_ADDRESS_MUST_BE_A_STRING
        },
        trim: true
      },
      deliveryMode: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.DELIVERY_MODE_IS_REQUIRED
        },
        isIn: {
          options: [DELIVERY_MODES],
          errorMessage: USERS_MESSAGES.DELIVERY_MODE_IS_INVALID
        }
      },
      distanceKm: {
        optional: true,
        isFloat: {
          options: { min: 0 },
          errorMessage: USERS_MESSAGES.DISTANCE_KM_MUST_BE_A_NON_NEGATIVE_NUMBER
        }
      },
      deliveryDistancesKm: {
        optional: true,
        isArray: {
          errorMessage: USERS_MESSAGES.DELIVERY_DISTANCES_MUST_BE_ARRAY
        }
      },
      paymentMethod: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PAYMENT_METHOD_IS_REQUIRED
        },
        isIn: {
          options: [PAYMENT_METHODS],
          errorMessage: USERS_MESSAGES.PAYMENT_METHOD_IS_INVALID
        }
      },
      note: {
        optional: true,
        isString: {
          errorMessage: USERS_MESSAGES.NOTE_MUST_BE_A_STRING
        }
      },
      deliveryDates: {
        optional: true,
        isArray: {
          errorMessage: USERS_MESSAGES.DELIVERY_DATES_MUST_BE_ARRAY
        }
      }
    },
    ['body']
  )
)

export const createOrderValidator = quoteOrderValidator

export const orderIdParamValidator = validate(
  checkSchema(
    {
      orderId: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.ORDER_ID_IS_REQUIRED
        },
        isMongoId: {
          errorMessage: USERS_MESSAGES.ORDER_ID_IS_INVALID
        }
      }
    },
    ['params']
  )
)

export const updateOrderStatusValidator = validate(
  checkSchema(
    {
      status: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.ORDER_STATUS_IS_REQUIRED
        },
        isIn: {
          options: [ORDER_NEXT_STATUSES],
          errorMessage: USERS_MESSAGES.ORDER_STATUS_IS_INVALID
        }
      }
    },
    ['body']
  )
)

export const retryPaymentValidator = validate(
  checkSchema(
    {
      paymentMethod: {
        optional: true,
        isIn: {
          options: [PAYMENT_METHODS],
          errorMessage: USERS_MESSAGES.PAYMENT_METHOD_IS_INVALID
        }
      }
    },
    ['body']
  )
)

export const updatePaymentStatusValidator = validate(
  checkSchema(
    {
      status: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PAYMENT_STATUS_IS_REQUIRED
        },
        isIn: {
          options: [PAYMENT_STATUSES],
          errorMessage: USERS_MESSAGES.PAYMENT_STATUS_IS_INVALID
        }
      },
      transactionId: {
        optional: true,
        isString: {
          errorMessage: USERS_MESSAGES.TRANSACTION_ID_MUST_BE_A_STRING
        }
      }
    },
    ['body']
  )
)
