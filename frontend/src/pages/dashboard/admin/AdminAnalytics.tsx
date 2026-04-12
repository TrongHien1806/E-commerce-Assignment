import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  ShoppingBag, 
  Star,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { cn } from '@/lib/utils';

const acquisitionData = [
  { name: 'Thứ 2', users: 400 },
  { name: 'Thứ 3', users: 300 },
  { name: 'Thứ 4', users: 600 },
  { name: 'Thứ 5', users: 800 },
  { name: 'Thứ 6', users: 500 },
  { name: 'Thứ 7', users: 900 },
  { name: 'Chủ Nhật', users: 1100 },
];

const topSellers = [
  { name: 'Salad ức gà', sales: 450, growth: '+12%', color: '#c1e06d' },
  { name: 'Cơm gạo lứt thịt heo', sales: 380, growth: '+8%', color: '#ff9f59' },
  { name: 'Bánh mì ngũ cốc', sales: 310, growth: '+15%', color: '#3b82f6' },
  { name: 'Sữa chua yến mạch', sales: 290, growth: '-2%', color: '#ef4444' },
  { name: 'Cơm thịt bò', sales: 250, growth: '+5%', color: '#8b5cf6' },
];

export default function AdminAnalytics() {
  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col">
        <Header title="Báo cáo Thống kê" userRole="Quản trị viên" hideSearch={true} />
        
        <main className="p-8 space-y-10 overflow-y-auto">
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 flex items-center justify-between group hover:shadow-xl transition-all">
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tổng người dùng mới</p>
                <h3 className="text-4xl font-black text-gray-900">4,600</h3>
                <div className="flex items-center gap-2 text-green-500 font-bold text-sm">
                  <ArrowUpRight size={16} />
                  <span>+24% tháng này</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <Users size={32} />
              </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 flex items-center justify-between group hover:shadow-xl transition-all">
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Số suất ăn bán ra</p>
                <h3 className="text-4xl font-black text-gray-900">12,850</h3>
                <div className="flex items-center gap-2 text-green-500 font-bold text-sm">
                  <ArrowUpRight size={16} />
                  <span>+18% tháng này</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-orange-50 rounded-3xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                <ShoppingBag size={32} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Acquisition Chart */}
            <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-gray-900">Tăng trưởng người dùng</h2>
                  <p className="text-xs text-gray-400 font-medium mt-1">Số lượng đăng ký mới trong 7 ngày qua</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-500">
                  Tuần này
                </div>
              </div>
              
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={acquisitionData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 600 }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f9fafb' }}
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="users" fill="#c1e06d" radius={[10, 10, 0, 0]} barSize={40}>
                      {acquisitionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 6 ? '#c1e06d' : '#e5e7eb'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top 5 Best Sellers */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-8">
              <h2 className="text-xl font-black text-gray-900">Top 5 Bán chạy nhất</h2>
              <div className="space-y-6">
                {topSellers.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm" style={{ backgroundColor: item.color }}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.sales} suất đã bán</p>
                      </div>
                    </div>
                    <div className={cn(
                      "text-[10px] font-black px-2 py-1 rounded-lg",
                      item.growth.startsWith('+') ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500"
                    )}>
                      {item.growth}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 bg-gray-50 text-gray-900 rounded-2xl text-xs font-black hover:bg-gray-100 transition-all">
                Xem chi tiết báo cáo kho
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
