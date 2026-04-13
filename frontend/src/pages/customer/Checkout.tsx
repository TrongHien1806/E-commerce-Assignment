import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, CreditCard, Truck, ChevronRight, ArrowLeft, CheckCircle2, ShieldCheck, Wallet, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Navbar from '@/components/layout/Navbar';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import api from '@/services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  
  // States lưu thông tin Form
  const [address, setAddress] = useState('Đại học Bách Khoa TP.HCM, Cơ sở Dĩ An');
  const [phone, setPhone] = useState('0987654321');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VNPay' | 'MoMo'>('COD');

  // States lưu dữ liệu Báo giá (Quote) và Đặt hàng
  const [quoteInfo, setQuoteInfo] = useState<any>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // GỌI API BÁO GIÁ: Tự động chạy khi user thay đổi thông tin
  useEffect(() => {
    const fetchQuote = async () => {
      if (items.length === 0) return;
      try {
        setIsLoadingQuote(true);
        // Gọi API Quote theo spec của bạn
        const res = await api.post('/orders/quote', {
          deliveryAddress: address,
          deliveryDate: new Date().toISOString(), // Giao trong ngày
          cartType: 'FOOD', // Loại giỏ hàng
          distanceKm: 5, // Tạm fix 5km. Nếu bạn tích hợp API Map thì truyền số thật vào đây
          note: note,
          paymentMethod: paymentMethod
        });
        setQuoteInfo(res.data.result);
      } catch (err) {
        console.error('Lỗi tính phí vận chuyển:', err);
      } finally {
        setIsLoadingQuote(false);
      }
    };

    // Debounce 800ms để người dùng gõ xong địa chỉ mới gọi API
    const timer = setTimeout(fetchQuote, 800); 
    return () => clearTimeout(timer);
  }, [items, address, note, paymentMethod]);

  // XỬ LÝ CHỐT ĐƠN
  const handleCheckout = async () => {
    if (items.length === 0) return;
    try {
      setIsProcessing(true);
      
      const payload = {
        deliveryAddress: address,
        deliveryDate: new Date().toISOString(),
        cartType: 'FOOD',
        distanceKm: 5,
        note: note,
        paymentMethod: paymentMethod
      };

      // Gửi request tạo đơn hàng
      const res = await api.post('/orders', payload);
      
      setShowSuccess(true);
      await clearCart(); // Xóa sạch giỏ hàng FE & BE
      
    } catch (err: any) {
      console.error("Lỗi đặt hàng:", err);
      alert(err.response?.data?.message || "Có lỗi xảy ra khi đặt hàng!");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !showSuccess) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <p className="text-xl font-bold">Giỏ hàng của bạn đang trống.</p>
        <Button className="mt-4" onClick={() => navigate('/food-catalog')}>Quay lại thực đơn</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <Link to="/cart" className="inline-flex items-center text-gray-500 hover:text-orange-500 mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Quay lại giỏ hàng
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Cột trái: Form thông tin */}
          <div className="space-y-8">
            <h1 className="text-3xl font-black text-gray-900">Thanh toán</h1>
            
            {/* Thông tin giao hàng */}
            <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Giao hàng đến</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Họ và tên người nhận" defaultValue="Lý Quốc Hào" />
                  <Input 
                    placeholder="Số điện thoại" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)} 
                  />
                </div>
                <Input 
                  placeholder="Địa chỉ giao hàng" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <Input 
                  placeholder="Ghi chú cho tài xế (Tùy chọn)" 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </section>

            {/* Phương thức thanh toán */}
            <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                  <Wallet size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Phương thức thanh toán</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { id: 'COD', title: 'Thanh toán khi nhận hàng (COD)', icon: <Truck size={20} />, desc: 'Thanh toán bằng tiền mặt khi nhận món' },
                  { id: 'VNPay', title: 'Thanh toán qua VNPay', icon: <CreditCard size={20} />, desc: 'Quét mã QR qua ứng dụng ngân hàng' },
                  { id: 'MoMo', title: 'Ví điện tử MoMo', icon: <ShieldCheck size={20} />, desc: 'Thanh toán an toàn qua MoMo' }
                ].map((method) => (
                  <label 
                    key={method.id}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all",
                      paymentMethod === method.id 
                        ? "border-orange-500 bg-orange-50" 
                        : "border-gray-100 hover:border-gray-200"
                    )}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      className="mt-1"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id as any)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-gray-900">
                        {method.icon} {method.title}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Cột phải: Hóa đơn tóm tắt */}
          <div>
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm sticky top-24 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-100">Đơn hàng của bạn</h2>
              
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</h4>
                      <p className="text-gray-500 text-sm mt-1">{item.price.toLocaleString('vi-VN')}đ x {item.qty}</p>
                    </div>
                    <p className="font-bold text-gray-900">{(item.price * item.qty).toLocaleString('vi-VN')}đ</p>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-gray-500">
                  <span>Tạm tính</span>
                  <span className="font-bold text-gray-900">
                    {/* Bọc an toàn: Nếu quoteInfo.subtotal không tồn tại thì lấy subtotal, nếu không có nữa thì lấy 0 */}
                    {(quoteInfo?.subtotal ?? subtotal ?? 0).toLocaleString('vi-VN')}đ
                  </span>
                </div>
                
                <div className="flex justify-between text-gray-500">
                  <span>Phí giao hàng {isLoadingQuote && <span className="text-xs text-orange-500 animate-pulse">(Đang tính...)</span>}</span>
                  <span className="font-bold text-gray-900">
                    {(quoteInfo?.shippingFee ?? 0).toLocaleString('vi-VN')}đ
                  </span>
                </div>
                
                <div className="flex justify-between text-lg pt-3 border-t border-gray-100">
                  <span className="font-black text-gray-900">Tổng thanh toán</span>
                  <span className="font-black text-orange-500 text-2xl">
                    {(quoteInfo?.grandTotal ?? subtotal ?? 0).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              <Button 
                className="w-full h-14 rounded-2xl text-lg shadow-lg shadow-orange-200 mt-6"
                onClick={handleCheckout}
                disabled={isProcessing || isLoadingQuote}
              >
                {isProcessing ? 'Đang xử lý...' : `Đặt hàng ngay (${items.length} món)`}
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Thành Công */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[40px] p-10 max-w-md w-full text-center space-y-6 shadow-2xl"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-gray-900">Đặt hàng thành công!</h2>
                <p className="text-gray-500">Đơn hàng của bạn đã được ghi nhận vào hệ thống và đang chờ bếp chuẩn bị.</p>
              </div>
              <Button 
                className="w-full h-14 rounded-2xl text-lg"
                onClick={() => navigate('/dashboard/user')}
              >
                Về trang Quản lý Đơn hàng
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}