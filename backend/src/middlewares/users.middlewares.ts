import { checkSchema } from 'express-validator'
import { TokenType } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.request'
import { UserRole } from '~/models/schemas/User.schema'
import usersService from '~/services/user.services'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

export const registerValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value: string) => {
            const existed = await usersService.checkEmailExist(value)
            if (existed) {
              throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      username: {
        optional: true,
        isString: {
          errorMessage: 'Username must be a string'
        },
        isLength: {
          options: {
            min: 3,
            max: 30
          },
          errorMessage: 'Username length must be from 3 to 30'
        },
        trim: true,
        custom: {
          options: async (value: string) => {
            if (!value) return true
            const existed = await usersService.checkUsernameExist(value)
            if (existed) {
              throw new Error('Username already exists')
            }
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 8,
            max: 50
          },
          errorMessage: 'Password length must be from 8 to 50'
        },
        isStrongPassword: {
          options: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0
          },
          errorMessage: 'Mật khẩu phải dài ít nhất 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 số'
        }
      },
      confirm_password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
        },
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
            }
            return true
          }
        }
      },
      phone: {
        notEmpty: {
          errorMessage: 'Phone is required'
        },
        matches: {
          options: /^(0[3|5|7|8|9])[0-9]{8}$/,
          errorMessage: 'Số điện thoại không hợp lệ (định dạng Việt Nam 10 số)'
        }
      },
      role: {
        optional: true,
        isIn: {
          options: [[UserRole.CUSTOMER, UserRole.PT]],
          errorMessage: 'Role must be Customer or PT'
        }
      }
    },
    ['body']
  )
)

export const loginValidator = validate(
  checkSchema(
    {
      identifier: {
        notEmpty: {
          errorMessage: 'Identifier is required (email or username)'
        },
        isString: {
          errorMessage: 'Identifier must be a string'
        },
        trim: true
      },
      password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
        }
      },
      remember_me: {
        optional: true,
        isBoolean: {
          errorMessage: 'remember_me must be a boolean'
        }
      }
    },
    ['body']
  )
)

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true
      }
    },
    ['body']
  )
)

export const resetPasswordValidator = validate(
  checkSchema(
    {
      user_id: {
        notEmpty: {
          errorMessage: 'user_id is required'
        },
        isString: {
          errorMessage: 'user_id must be a string'
        }
      },
      forgot_password_token: {
        notEmpty: {
          errorMessage: 'forgot_password_token is required'
        },
        isString: {
          errorMessage: 'forgot_password_token must be a string'
        }
      },
      password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 8,
            max: 50
          },
          errorMessage: 'Password length must be from 8 to 50'
        }
      },
      confirm_password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
        },
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        notEmpty: {
          errorMessage: 'refresh_token is required'
        },
        isString: {
          errorMessage: 'refresh_token must be a string'
        },
        custom: {
          options: async (value, { req }) => {
            const decoded_refresh_token = await verifyToken({
              token: value,
              secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
            })
            if (decoded_refresh_token.token_type !== TokenType.RefreshToken) {
              throw new ErrorWithStatus({
                message: 'Invalid refresh token type',
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            ;(req as { decoded_refresh_token?: TokenPayload }).decoded_refresh_token = decoded_refresh_token
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value, { req }) => {
            const authorization = (value || req?.headers?.authorization) as string
            if (!authorization) {
              throw new ErrorWithStatus({
                message: 'Access token is required',
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            const access_token = authorization.split(' ')[1]
            if (!access_token) {
              throw new ErrorWithStatus({
                message: 'Access token is invalid',
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            const decoded_authorization = await verifyToken({
              token: access_token,
              secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
            })
            if (decoded_authorization.token_type !== TokenType.AccessToken) {
              throw new ErrorWithStatus({
                message: 'Invalid access token type',
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            ;(req as { decoded_authorization?: TokenPayload }).decoded_authorization =
              decoded_authorization as TokenPayload
            return true
          }
        }
      }
    },
    ['headers']
  )
)
