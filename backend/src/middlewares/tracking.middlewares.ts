import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const updateWeightValidator = validate(
  checkSchema({
    date: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Ngày là bắt buộc'
      },
      isISO8601: {
        errorMessage: 'Định dạng ngày không hợp lệ'
      }
    },
    weightKg: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Cân nặng là bắt buộc'
      },
      isFloat: {
        options: { min: 30, max: 300 },
        errorMessage: 'Cân nặng phải từ 30kg đến 300kg'
      },
      toFloat: true
    }
  })
)
