import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Flame, CreditCard, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import Navbar from '@/components/layout/Navbar';
import { useCart } from '@/context/CartContext';

export default function Cart() {
  const { items, updateQty, removeItem, subtotal } = useCart();

  // Tính tổng calo
  const totalCalories = items.reduce((acc, item) => acc + (item.calories || 0) * item.qty, 0);
  const estimatedShipping = 20000; // Phí ship dự kiến

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-6">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <ShoppingBag size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Giỏ hàng trống</h2>
            <p className="text-gray-500">Hãy chọn những món ăn dinh dưỡng cho hôm nay nhé!</p>
          </div>
          <Link to="/food-catalog">
            <Button className="rounded-2xl px-8 h-12">Khám phá thực đơn</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Giỏ hàng của bạn</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Danh sách món */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, x: -20 }}
                  className="bg-white p-4 rounded-[24px] border border-gray-100 flex gap-4 items-center group"
                >
                  <div className="w-24 h-24 rounded-[16px] overflow-hidden bg-gray-50 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-orange-500 font-black">{item.price.toLocaleString('vi-VN')}đ</p>
                      <div className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                        <Flame size={14} /> {item.calories || 0} kcal
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl">
                      <button 
                        onClick={() => updateQty(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-500 hover:text-orange-500 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-6 text-center font-bold text-sm">{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-500 hover:text-orange-500 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div>
            <div className="bg-white rounded-[32px] border border-gray-100 p-6 sticky top-24 space-y-6">
              <h2 className="text-xl font-black text-gray-900">Tóm tắt đơn hàng</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-gray-500">
                  <span>Tạm tính ({items.length} món)</span>
                  <span className="font-bold text-gray-900">{subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                
                <div className="flex items-center justify-between text-gray-500">
                  <span>Phí giao hàng (Dự kiến)</span>
                  <span className="font-bold text-gray-900">{estimatedShipping.toLocaleString('vi-VN')}đ</span>
                </div>

                {/* Phần hiển thị Tổng Calo được bổ sung */}
                <div className="flex justify-between text-sm pt-4 border-t border-gray-50">
                  <span className="text-gray-500">Tổng Calo</span>
                  <span className="font-bold text-orange-500 flex items-center gap-1">
                    <Flame size={16} /> {totalCalories} kcal
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-lg">
                  <span className="font-bold text-gray-900">Tổng cộng</span>
                  <span className="font-black text-orange-500">{(subtotal + estimatedShipping).toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <Truck size={20} className="text-gray-400" />
                  <div className="text-xs">
                    <p className="font-bold text-gray-900">Giao hàng nhanh</p>
                    <p className="text-gray-500">Dự kiến: 30 - 45 phút</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <CreditCard size={20} className="text-gray-400" />
                  <div className="text-xs">
                    <p className="font-bold text-gray-900">Thanh toán linh hoạt</p>
                    <p className="text-gray-500">COD, VNPay, MoMo</p>
                  </div>
                </div>
              </div>

              <Link to="/checkout">
                <Button className="w-full h-14 text-lg rounded-2xl shadow-lg shadow-orange-200 mt-4">
                  Tiến hành thanh toán <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}