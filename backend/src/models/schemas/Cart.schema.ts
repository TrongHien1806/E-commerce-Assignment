import { ObjectId } from 'mongodb'

export type CartItemType = 'Food' | 'PTService'

export interface CartItem {
  itemType: CartItemType
  itemId: ObjectId // reference đến foods hoặc pt_services
  quantity: number
  priceAtOrder: number
}

export interface CartType {
  _id?: ObjectId
  userId: ObjectId
  items: CartItem[]
  createdAt?: Date
  updatedAt?: Date
}
export default class Cart implements CartType {
  _id?: ObjectId
  userId: ObjectId
  items: CartItem[]
  createdAt?: Date
  updatedAt?: Date
  constructor(cart: CartType) {
    this._id = cart._id
    this.userId = cart.userId
    this.items = cart.items
    const now = new Date()
    this.createdAt = cart.createdAt || now
    this.updatedAt = cart.updatedAt || now
  }
  // Helper method để thêm item vào giỏ
  addItem(item: CartItem) {
    const existingItem = this.items.find((i) => i.itemType === item.itemType && i.itemId.equals(item.itemId))
    if (existingItem) {
      existingItem.quantity += item.quantity
      existingItem.priceAtOrder = item.priceAtOrder // update giá tại thời điểm order
    } else {
      this.items.push(item)
    }
    this.updatedAt = new Date()
  }

  // Helper method để xóa item khỏi giỏ
  removeItem(itemId: ObjectId, itemType: CartItemType) {
    this.items = this.items.filter((i) => !(i.itemId.equals(itemId) && i.itemType === itemType))
    this.updatedAt = new Date()
  }
}
