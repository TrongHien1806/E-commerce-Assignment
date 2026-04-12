import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  Users,
  Download,
  DollarSign,
  Megaphone,
  Wallet
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { cn } from '@/lib/utils';

const kpiData = {
  foodRevenue: 4500000,
  ptCommission: 4500000,
  marketingCost: 9000000
};

const profitData = [
  { month: 'Tháng 1', profit: 0 },
  { month: 'Tháng 2', profit: -3000000 },
  { month: 'Tháng 3', profit: 8000000 },
];

const transactions = [
  { id: 'TNX12', user: 'Nguyễn Văn An', method: 'OCB', amount: '254.000 đ', date: '02/04/2026', time: '14:30', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 'TNX23', user: 'Trần Thị Bình', method: 'VNPay', amount: '675.000 đ', date: '30/03/2026', time: '09:15', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 'TNX34', user: 'Lê Văn Cường', method: 'MoMo', amount: '100.000 đ', date: '30/03/2026', time: '18:45', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 'TNX45', user: 'Phạm Minh Đức', method: 'VNPay', amount: '150.000 đ', date: '29/03/2026', time: '11:20', avatar: 'https://i.pravatar.cc/150?u=4' },
];

export default function AdminDashboard() {
  const handleExportData = () => {
    console.log('Exporting data to Excel...');
    alert('Đang khởi tạo quá trình xuất dữ liệu báo cáo Lãi & Lỗ sang định dạng Excel...');
  };

  // Logic for gradient offset based on 0 value
  const off = () => {
    const dataMax = Math.max(...profitData.map((i) => i.profit));
    const dataMin = Math.min(...profitData.map((i) => i.profit));

    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;

    return dataMax / (dataMax - dataMin);
  };

  const gradientOffset = off();

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar role="admin" />
      
      <div className="flex-1 flex flex-col">
        <Header title="Quản lý tài chính" userRole="Quản trị viên" hideSearch={true} />
        
        <main className="p-8 space-y-10 overflow-y-auto">
          {/* KPI Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 space-y-4 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">Doanh thu Đồ ăn</p>
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <ShoppingBag size={20} />
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-900">{(kpiData.foodRevenue / 1000000).toFixed(1)}M VNĐ</h3>
              <div className="flex items-center gap-1 text-[10px] font-bold text-green-500">
                <TrendingUp size={12} />
                <span>+12.5% so với tháng trước</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 space-y-4 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">Hoa hồng PT</p>
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <Users size={20} />
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-900">{(kpiData.ptCommission / 1000000).toFixed(1)}M VNĐ</h3>
              <div className="flex items-center gap-1 text-[10px] font-bold text-green-500">
                <TrendingUp size={12} />
                <span>+8.2% so với tháng trước</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 space-y-4 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">Chi phí Marketing</p>
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                  <Megaphone size={20} />
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-900">{(kpiData.marketingCost / 1000000).toFixed(1)}M VNĐ</h3>
              <div className="flex items-center gap-1 text-[10px] font-bold text-red-500">
                <TrendingDown size={12} />
                <span>+15% chi phí vận hành</span>
              </div>
            </div>
          </section>

          {/* Profit & Loss Report */}
          <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-gray-900">Báo cáo Lãi & Lỗ</h2>
                <p className="text-xs text-gray-400 font-medium mt-1">Phân tích dòng tiền thực tế dựa trên doanh thu và chi phí</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleExportData}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-2xl text-xs font-black hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                >
                  <Download size={16} />
                  Xuất báo cáo Excel
                </button>
              </div>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={profitData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset={gradientOffset} stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset={gradientOffset} stopColor="#ef4444" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 600 }}
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 600 }}
                    tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
                    domain={[-5000000, 10000000]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '24px', 
                      border: 'none', 
                      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                      padding: '16px'
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()} VNĐ`, 'Lợi nhuận']}
                    itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                  />
                  <ReferenceLine y={0} stroke="#374151" strokeWidth={2} />
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#374151" 
                    strokeWidth={2}
                    fill="url(#splitColor)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lãi (Profit)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lỗ (Loss)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hòa vốn (Breakeven)</span>
              </div>
            </div>
          </section>

          {/* Transaction History */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">Lịch sử giao dịch gần đây</h2>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm giao dịch..." 
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 w-64"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {transactions.map((tnx) => (
                <div key={tnx.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <img src={tnx.avatar} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt={tnx.user} />
                    <div>
                      <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{tnx.user}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="px-2 py-0.5 bg-gray-100 rounded-md text-[9px] font-black text-gray-500 uppercase">{tnx.method}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{tnx.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right pr-4">
                    <p className="text-sm font-black text-gray-900">{tnx.amount}</p>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">{tnx.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
