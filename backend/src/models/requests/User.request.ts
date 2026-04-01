import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'
import { HealthProfile, PTProfile, UserRole } from '~/models/schemas/User.schema'

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  exp: number
  iat: number
  status?: string
}

export interface RegisterReqBody {
  email: string
  username?: string
  password: string
  phone: string
  role?: UserRole
  healthProfile?: HealthProfile
  ptProfile?: PTProfile
}

export interface LoginReqBody {
  identifier: string // email hoặc username
  password: string
  remember_me?: boolean
}

export interface UpdateMeReqBody {
  username?: string
  phone?: string
  date_of_birth?: string
  healthProfile?: HealthProfile
  ptProfile?: PTProfile
}
