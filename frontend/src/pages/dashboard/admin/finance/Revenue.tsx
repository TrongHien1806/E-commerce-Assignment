import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { ShoppingBag, Users, Truck, TrendingUp } from 'lucide-react';

export default function FinanceRevenue() {
  const revenueSources = [
    { name: 'Đồ ăn (Food)', amount: '4.500.000 đ', icon: <ShoppingBag />, color: 'bg-orange-500' },
    { name: 'Phí giao hàng (Delivery)', amount: '850.000 đ', icon: <Truck />, color: 'bg-blue-500' },
    { name: 'Hoa hồng PT (Commission)', amount: '4.500.000 đ', icon: <Users />, color: 'bg-green-500' },
  ];

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col">
        <Header title="Theo dõi Doanh thu" userRole="Quản trị viên" hideSearch={true} />
        <main className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {revenueSources.map((source, i) => (
              <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-4">
                <div className={`w-12 h-12 ${source.color} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
                  {source.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{source.name}</p>
                  <h3 className="text-2xl font-black text-gray-900 mt-1">{source.amount}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 h-[400px] flex items-center justify-center">
            <p className="text-gray-400 font-bold italic">Biểu đồ bóc tách doanh thu chi tiết đang được tải...</p>
          </div>
        </main>
      </div>
    </div>
  );
}
