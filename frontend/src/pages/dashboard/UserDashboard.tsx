import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell
} from 'recharts';
import { Flame, Coffee, Fish, Droplets, MoreHorizontal } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import StatCard from '@/components/dashboard/StatCard';

const calorieData = [
  { name: 'CN', consumed: 1400, burned: 1100 },
  { name: 'T2', consumed: 1650, burned: 1250 },
  { name: 'T3', consumed: 1850, burned: 1750 },
  { name: 'T4', consumed: 1800, burned: 1650 },
  { name: 'T5', consumed: 1700, burned: 1050 },
  { name: 'T6', consumed: 1350, burned: 900 },
  { name: 'T7', consumed: 1500, burned: 1100 },
];

const weightData = [
  { month: 'Th4', weight: 85 },
  { month: 'Th5', weight: 83 },
  { month: 'Th6', weight: 80 },
  { month: 'Th7', weight: 73 },
  { month: 'Th8', weight: 80 },
  { month: 'Th9', weight: 78 },
];

export default function UserDashboard() {
  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar role="user" />
      
      <div className="flex-1 flex flex-col">
        <Header title="Bảng điều khiển" userName="Nam" userRole="Người dùng" avatar="https://i.pravatar.cc/150?u=nam" hideSearch={true} />
        
        <main className="p-8 space-y-8 overflow-y-auto">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Tổng Calories"
              value="12,615"
              unit="kcal"
              change="+1.45%"
              isPositive={true}
              icon={<Flame size={24} className="text-gray-900" />}
              iconBgColor="bg-[#c1e06d]"
            />
            <StatCard 
              title="Tổng Carb"
              value="2,100"
              unit="gr"
              change="+0.78%"
              isPositive={true}
              icon={<Coffee size={24} className="text-gray-900" />}
              iconBgColor="bg-[#ffcc80]"
            />
            <StatCard 
              title="Tổng Protein"
              value="498"
              unit="gr"
              change="-2.84%"
              isPositive={false}
              icon={<Fish size={24} className="text-gray-900" />}
              iconBgColor="bg-[#ff9f59]"
            />
            <StatCard 
              title="Tổng Chất béo"
              value="285"
              unit="gr"
              change="+4.16%"
              isPositive={true}
              icon={<Droplets size={24} className="text-gray-900" />}
              iconBgColor="bg-[#e0e0e0]"
            />
          </div>

          {/* Calories Activities */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-900">Hoạt động Calories</h2>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-sm font-bold text-gray-900">450 <span className="text-gray-400 font-medium">kcal còn lại</span></p>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Mục tiêu: 2,000 kcal</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#ffcc80]" />
                    <span className="text-gray-400">Đã nạp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#ff9f59]" />
                    <span className="text-gray-400">Đã đốt</span>
                  </div>
                </div>
                <select className="bg-gray-50 border-none text-[10px] font-bold uppercase tracking-wider rounded-xl px-3 py-2 outline-none cursor-pointer">
                  <option>7 ngày qua</option>
                </select>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calorieData} barGap={8}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="consumed" fill="#ffcc80" radius={[4, 4, 0, 0]} barSize={32} />
                  <Bar dataKey="burned" fill="#ff9f59" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weight Tracking */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">Theo dõi Cân nặng</h2>
              <button className="text-gray-400 hover:text-gray-900">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cân nặng bắt đầu</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">85 <span className="text-sm font-bold text-gray-400">Kg</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cân nặng hiện tại</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">78 <span className="text-sm font-bold text-gray-400">Kg</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mục tiêu cân nặng</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">65 <span className="text-sm font-bold text-gray-400">Kg</span></p>
                </div>
              </div>

              <div className="md:col-span-3 h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weightData}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffcc80" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ffcc80" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#ffcc80" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorWeight)" 
                      dot={{ r: 4, fill: '#ffcc80', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
