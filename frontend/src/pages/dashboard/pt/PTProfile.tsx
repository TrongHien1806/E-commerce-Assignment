import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  Flame, 
  Utensils, 
  Zap, 
  Droplets,
  TrendingUp,
  TrendingDown,
  Search,
  Bell
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { cn } from '@/lib/utils';

const calorieData = [
  { day: 'CN', consumed: 1400, burned: 1000 },
  { day: 'T2', consumed: 1600, burned: 1200 },
  { day: 'T3', consumed: 1800, burned: 1700 },
  { day: 'T4', consumed: 1750, burned: 1650 },
  { day: 'T5', consumed: 1650, burned: 1100 },
  { day: 'T6', consumed: 1300, burned: 900 },
  { day: 'T7', consumed: 1550, burned: 1150 },
];

const weightData = [
  { month: 'Th4', weight: 85 },
  { month: 'Th5', weight: 83 },
  { month: 'Th6', weight: 80 },
  { month: 'Th7', weight: 73 },
  { month: 'Th8', weight: 80 },
  { month: 'Th9', weight: 78 },
];

export default function PTProfile() {
  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar role="pt" />
      
      <div className="flex-1 flex flex-col">
        <Header title="Hồ sơ học viên: Nguyễn Văn A" userRole="Huấn luyện viên" avatar="https://i.pravatar.cc/150?u=pt" />

        <main className="p-8 space-y-10 overflow-y-auto">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="Tổng Calories"
              value="12,615"
              unit="kcal"
              change="+1.45%"
              icon={<Flame size={24} />}
              color="bg-[#d4e157]"
            />
            <MetricCard 
              title="Tổng Carb"
              value="2,100"
              unit="gr"
              change="+0.78%"
              icon={<Utensils size={24} />}
              color="bg-[#ffd54f]"
            />
            <MetricCard 
              title="Tổng Protein"
              value="498"
              unit="gr"
              change="-2.84%"
              icon={<Zap size={24} />}
              color="bg-[#ffab91]"
            />
            <MetricCard 
              title="Tổng Chất béo"
              value="285"
              unit="gr"
              change="+4.16%"
              icon={<Droplets size={24} />}
              color="bg-[#e0e0e0]"
            />
          </div>

          {/* Calories Activities Chart */}
          <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">Hoạt động Calories</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#ffd54f]" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Hấp thụ</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#ffab91]" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Đốt cháy</span>
                </div>
                <select className="bg-gray-50 border-none text-[10px] font-bold uppercase tracking-wider rounded-xl px-3 py-1.5 outline-none">
                  <option>7 ngày qua</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-2xl font-black text-gray-900">450 <span className="text-sm text-gray-400 font-bold uppercase">kcal còn lại</span></p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Mục tiêu: 2,000 kcal</p>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calorieData} barGap={8}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="consumed" fill="#ffd54f" radius={[6, 6, 0, 0]} barSize={32} />
                  <Bar dataKey="burned" fill="#ffab91" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Weight Tracking Chart */}
          <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">Theo dõi cân nặng</h2>
              <button className="text-gray-400 hover:text-gray-900">
                <TrendingUp size={20} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cân nặng bắt đầu</p>
                <p className="text-2xl font-black text-gray-900">85 <span className="text-xs text-gray-400">Kg</span></p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cân nặng hiện tại</p>
                <p className="text-2xl font-black text-gray-900">78 <span className="text-xs text-gray-400">Kg</span></p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mục tiêu</p>
                <p className="text-2xl font-black text-gray-900">65 <span className="text-xs text-gray-400">Kg</span></p>
              </div>
            </div>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffd54f" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ffd54f" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    hide
                    domain={['dataMin - 5', 'dataMax + 5']}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#ffd54f" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorWeight)" 
                    dot={{ r: 6, fill: '#ffd54f', strokeWidth: 3, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function MetricCard({ title, value, unit, change, icon, color }: any) {
  const isPositive = change.startsWith('+');
  return (
    <div className={cn("p-6 rounded-[32px] flex items-center gap-6 shadow-sm border border-gray-50", color)}>
      <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-900">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-1">
          <h3 className="text-2xl font-black text-gray-900">{value}</h3>
          <span className="text-xs font-bold text-gray-600">{unit}</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          {isPositive ? <TrendingUp size={12} className="text-gray-900" /> : <TrendingDown size={12} className="text-gray-900" />}
          <span className="text-[10px] font-black text-gray-900">{change}</span>
          <span className="text-[10px] text-gray-600 font-medium">so với tuần trước</span>
        </div>
      </div>
    </div>
  );
}
