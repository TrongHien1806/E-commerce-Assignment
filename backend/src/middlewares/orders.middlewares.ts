import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const createOrderValidator = validate(
  checkSchema({
    items: {
      in: ['body'],
      custom: {
        options: (value) => {
          if (!Array.isArray(value)) {
            throw new Error('Danh sách sản phẩm phải là một mảng')
          }
          if (value.length === 0) {
            throw new Error('Giỏ hàng trống')
          }
          return true
        }
      }
    },

    'items.*.itemType': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Loại sản phẩm là bắt buộc'
      },
      isIn: {
        options: [['Food', 'PTService']],
        errorMessage: 'Loại sản phẩm không hợp lệ'
      }
    },

    'items.*.itemId': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'ID sản phẩm là bắt buộc'
      },
      isMongoId: {
        errorMessage: 'ID sản phẩm không hợp lệ'
      }
    },

    'items.*.quantity': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Số lượng là bắt buộc'
      },
      isInt: {
        options: { min: 1 },
        errorMessage: 'Số lượng phải lớn hơn 0'
      },
      toInt: true
    },

    // Nếu bạn vẫn muốn nhận price từ client thì giữ lại.
    // Nhưng tốt hơn là bỏ hẳn field này và lấy giá thật từ DB trong service.
    'items.*.price': {
      in: ['body'],
      optional: true,
      isFloat: {
        options: { min: 0 },
        errorMessage: 'Giá không hợp lệ'
      },
      toFloat: true
    },

    deliveryAddress: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Địa chỉ giao hàng là bắt buộc'
      },
      isString: {
        errorMessage: 'Địa chỉ giao hàng phải là chuỗi'
      },
      trim: true
    },

    note: {
      in: ['body'],
      optional: true,
      isString: {
        errorMessage: 'Ghi chú phải là chuỗi'
      },
      trim: true
    },

    payment: {
      in: ['body'],
      custom: {
        options: (value) => {
          if (!value || typeof value !== 'object' || Array.isArray(value)) {
            throw new Error('Thông tin thanh toán không hợp lệ')
          }
          return true
        }
      }
    },

    'payment.method': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Phương thức thanh toán là bắt buộc'
      },
      isIn: {
        options: [['COD', 'VNPay', 'MoMo']],
        errorMessage: 'Phương thức thanh toán không hợp lệ'
      }
    }
  })
)
