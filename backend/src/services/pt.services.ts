import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import PTService from '~/models/schemas/PTService.schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'

class PTServiceLayer {
  async getPTUserByUsername(username: string) {
    return databaseService.users.findOne(
      { username, role: 'PT' as any },
      {
        projection: {
          password: 0,
          forgot_password_token: 0
        }
      }
    )
  }
  async getPTServiceList(limit: number, page: number) {
    const safeLimit = Math.max(1, Number(limit) || 10)
    const safePage = Math.max(1, Number(page) || 1)
    const skip = (safePage - 1) * safeLimit

    const filter = { isActive: true }

    const [services, total] = await Promise.all([
      databaseService.ptServices.find(filter).skip(skip).limit(safeLimit).sort({ createdAt: -1 }).toArray(),
      databaseService.ptServices.countDocuments(filter)
    ])

    return {
      services,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        total_pages: Math.ceil(total / safeLimit)
      }
    }
  }

  async getPTServiceById(service_id: string) {
    if (!ObjectId.isValid(service_id)) {
      throw new ErrorWithStatus({
        message: 'PT service id không hợp lệ',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const service = await databaseService.ptServices.findOne({
      _id: new ObjectId(service_id),
      isActive: true
    })

    if (!service) {
      throw new ErrorWithStatus({
        message: 'Không tìm thấy gói dịch vụ PT',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return service
  }

  async getServicesByPTId(pt_id: string, limit = 10, page = 1) {
    if (!ObjectId.isValid(pt_id)) {
      throw new ErrorWithStatus({
        message: 'PT id không hợp lệ',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const safeLimit = Math.max(1, Number(limit) || 10)
    const safePage = Math.max(1, Number(page) || 1)
    const skip = (safePage - 1) * safeLimit

    const filter = {
      ptId: new ObjectId(pt_id),
      isActive: true
    }

    const [services, total] = await Promise.all([
      databaseService.ptServices.find(filter).skip(skip).limit(safeLimit).sort({ createdAt: -1 }).toArray(),
      databaseService.ptServices.countDocuments(filter)
    ])

    return {
      services,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        total_pages: Math.ceil(total / safeLimit)
      }
    }
  }

  async createPTService(payload: {
    ptId: string
    title: string
    description: string
    price: number
    sessions: number
    durationDays: number
    isActive?: boolean
  }) {
    if (!ObjectId.isValid(payload.ptId)) {
      throw new ErrorWithStatus({
        message: 'PT id không hợp lệ',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const service = new PTService({
      ptId: new ObjectId(payload.ptId),
      title: payload.title.trim(),
      description: payload.description.trim(),
      price: payload.price,
      sessions: payload.sessions,
      durationDays: payload.durationDays,
      isActive: payload.isActive ?? true
    })

    const result = await databaseService.ptServices.insertOne(service)

    return {
      _id: result.insertedId,
      ...service
    }
  }

  async updatePTService(
    service_id: string,
    payload: Partial<{
      title: string
      description: string
      price: number
      sessions: number
      durationDays: number
      isActive: boolean
    }>
  ) {
    if (!ObjectId.isValid(service_id)) {
      throw new ErrorWithStatus({
        message: 'PT service id không hợp lệ',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const updateData: Record<string, any> = {}

    if (payload.title !== undefined) updateData.title = payload.title.trim()
    if (payload.description !== undefined) updateData.description = payload.description.trim()
    if (payload.price !== undefined) updateData.price = payload.price
    if (payload.sessions !== undefined) updateData.sessions = payload.sessions
    if (payload.durationDays !== undefined) updateData.durationDays = payload.durationDays
    if (payload.isActive !== undefined) updateData.isActive = payload.isActive

    const updated = await databaseService.ptServices.findOneAndUpdate(
      { _id: new ObjectId(service_id) },
      {
        $set: updateData,
        $currentDate: { updatedAt: true }
      },
      {
        returnDocument: 'after'
      }
    )

    if (!updated) {
      throw new ErrorWithStatus({
        message: 'Không tìm thấy gói dịch vụ PT',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return updated
  }

  async deletePTService(service_id: string) {
    if (!ObjectId.isValid(service_id)) {
      throw new ErrorWithStatus({
        message: 'PT service id không hợp lệ',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const updated = await databaseService.ptServices.findOneAndUpdate(
      { _id: new ObjectId(service_id) },
      {
        $set: { isActive: false },
        $currentDate: { updatedAt: true }
      },
      {
        returnDocument: 'after'
      }
    )

    if (!updated) {
      throw new ErrorWithStatus({
        message: 'Không tìm thấy gói dịch vụ PT',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return {
      message: 'Ẩn gói dịch vụ PT thành công',
      result: updated
    }
  }
}

const ptService = new PTServiceLayer()
export default ptService
