import { Request, Response } from 'express'
import ptService from '~/services/pt.services'
import HTTP_STATUS from '~/constants/httpStatus'

type PTServiceParams = {
  service_id: string
}

type PTServiceListQuery = {
  limit?: string
  page?: string
}

type CreatePTServiceBody = {
  ptId: string
  title: string
  description: string
  price: number
  sessions: number
  durationDays: number
  isActive?: boolean
}

export const getPTServiceListController = async (
  req: Request<Record<string, never>, any, any, PTServiceListQuery>,
  res: Response
) => {
  const limit = Math.max(1, Number(req.query.limit) || 10)
  const page = Math.max(1, Number(req.query.page) || 1)

  const result = await ptService.getPTServiceList(limit, page)

  return res.status(HTTP_STATUS.OK).json({
    message: 'Lấy danh sách gói PT thành công',
    result
  })
}

export const getPTServiceDetailController = async (req: Request<PTServiceParams>, res: Response) => {
  const { service_id } = req.params
  const result = await ptService.getPTServiceById(service_id)

  return res.status(HTTP_STATUS.OK).json({
    message: 'Lấy chi tiết gói PT thành công',
    result
  })
}

export const createPTServiceController = async (
  req: Request<Record<string, never>, any, CreatePTServiceBody>,
  res: Response
) => {
  const result = await ptService.createPTService(req.body)

  return res.status(HTTP_STATUS.CREATED).json({
    message: 'Tạo gói PT thành công',
    result
  })
}

export const getPTUserByUsernameController = async (req: Request, res: Response) => {
  const username = String(req.query.username || '').trim()
  const result = await ptService.getPTUserByUsername(username)

  return res.status(HTTP_STATUS.OK).json({
    message: 'Lấy PT user thành công',
    result
  })
}
