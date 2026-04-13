import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { Flame, Coffee, Fish, Droplets, MoreHorizontal, Loader2 } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import StatCard from '@/components/dashboard/StatCard';
import api from '@/services/api';

export default function UserDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardWarning, setDashboardWarning] = useState<string | null>(null);
  
  // State: Thống kê Calo & Macro hôm nay
  const [todayStats, setTodayStats] = useState({
    consumedCalories: 0,
    burnedCalories: 0,
    targetCalories: 2000,
    carbs: 0,
    protein: 0,
    fat: 0
  });

  // State: Lịch sử Calo (Biểu đồ cột)
  const [calorieHistory, setCalorieHistory] = useState<any[]>([]);

  // State: Lịch sử Cân nặng (Biểu đồ vùng) & Mục tiêu
  const [weightHistory, setWeightHistory] = useState<any[]>([]);
  const [weightMetrics, setWeightMetrics] = useState({
    startWeight: 0,
    currentWeight: 0,
    targetWeight: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setDashboardWarning(null);
        
        // Gọi song song và xử lý lỗi từng API để dashboard không văng toàn bộ.
        const [todayCalRes, historyCalRes, weightHistRes, profileRes] = await Promise.allSettled([
          api.get('/tracking/calories/today'),  // Từ tracking.routes.ts
          api.get('/tracking/calories'),        // Từ tracking.routes.ts
          api.get('/tracking/weight-history'),  // Từ tracking.routes.ts
          api.get('/users/me')
        ]);

        // 1. Cập nhật số liệu hôm nay (StatCards)
        if (todayCalRes.status === 'fulfilled' && todayCalRes.value.data?.result) {
          const t = todayCalRes.value.data.result;
          setTodayStats({
            consumedCalories: t.caloriesConsumed || 0,
            burnedCalories: 0,
            targetCalories: t.targetCalories || 2000,
            carbs: t.carbs || 0,
            protein: t.protein || 0,
            fat: t.fat || 0
          });
        }

        // 2. Cập nhật biểu đồ Calories
        if (historyCalRes.status === 'fulfilled' && historyCalRes.value.data?.result) {
          const rawHistory = historyCalRes.value.data.result?.history;
          const history = Array.isArray(rawHistory)
            ? rawHistory.map((item: any) => ({
                date: item.date ? new Date(item.date).toLocaleDateString('vi-VN') : '',
                consumed: Number(item.caloriesConsumed || 0),
                burned: 0
              }))
            : [];
          setCalorieHistory(history);

          const target = Number(historyCalRes.value.data.result?.targetCalories || 0);
          if (target > 0) {
            setTodayStats((prev) => ({ ...prev, targetCalories: target }));
          }
        }

        // 3. Cập nhật biểu đồ Cân nặng
        if (weightHistRes.status === 'fulfilled' && weightHistRes.value.data?.result) {
          const rawWeights = weightHistRes.value.data.result;
          const weights = Array.isArray(rawWeights)
            ? rawWeights.map((item: any) => ({
                date: item.date ? new Date(item.date).toLocaleDateString('vi-VN') : '',
                weight: Number(item.weightKg || 0)
              }))
            : [];
          setWeightHistory(weights);

          // Ưu tiên lấy cân nặng từ lịch sử nếu có dữ liệu.
          if (weights.length > 0) {
            const start = Number(weights[0]?.weight || 0);
            const current = Number(weights[weights.length - 1]?.weight || 0);
            setWeightMetrics((prev) => ({
              ...prev,
              startWeight: start,
              currentWeight: current
            }));
          }
        }

        // 4. Lấy health profile từ /users/me để tránh gọi endpoint health-metrics có thể trả 404.
        if (profileRes.status === 'fulfilled') {
          const profile = profileRes.value.data?.result?.healthProfile;
          if (profile) {
            setWeightMetrics((prev) => ({
              ...prev,
              startWeight: prev.startWeight || Number(profile.weightKg || 0),
              currentWeight: prev.currentWeight || Number(profile.weightKg || 0),
              targetWeight: Number(profile.targetWeight || 0)
            }));
          } else {
            setDashboardWarning('Bạn chưa khai báo hồ sơ sức khỏe. Một số chỉ số mục tiêu sẽ hiển thị mặc định.');
          }
        } else {
          console.error('Lỗi tải hồ sơ người dùng:', profileRes.reason);
        }

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-[#fafafa]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-orange-500" size={40} />
        </div>
      </div>
    );
  }

  // Tính lượng Calo còn lại có thể ăn trong ngày
  const remainingCalories = Math.max(0, todayStats.targetCalories - todayStats.consumedCalories + todayStats.burnedCalories);

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Bảng điều khiển" hideSearch={true} />
        
        <main className="p-8 space-y-8 overflow-y-auto min-w-0">
          {dashboardWarning ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {dashboardWarning}
            </div>
          ) : null}

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Calories đã nạp"
              value={todayStats.consumedCalories.toLocaleString()}
              unit="kcal"
              change=""
              isPositive={true}
              icon={<Flame size={24} className="text-gray-900" />}
              iconBgColor="bg-[#c1e06d]"
            />
            <StatCard 
              title="Carb đã nạp"
              value={todayStats.carbs.toLocaleString()}
              unit="gr"
              change=""
              isPositive={true}
              icon={<Coffee size={24} className="text-gray-900" />}
              iconBgColor="bg-[#ffcc80]"
            />
            <StatCard 
              title="Protein đã nạp"
              value={todayStats.protein.toLocaleString()}
              unit="gr"
              change=""
              isPositive={true}
              icon={<Fish size={24} className="text-gray-900" />}
              iconBgColor="bg-[#ff9f59]"
            />
            <StatCard 
              title="Fat đã nạp"
              value={todayStats.fat.toLocaleString()}
              unit="gr"
              change=""
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
                  <p className="text-sm font-bold text-gray-900">{remainingCalories.toLocaleString()} <span className="text-gray-400 font-medium">kcal còn lại</span></p>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Mục tiêu: {todayStats.targetCalories.toLocaleString()} kcal</p>
                </div>
              </div>
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
            </div>

            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calorieHistory} barGap={8}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                  {/* Cập nhật dataKey tương ứng với BE (ví dụ BE trả về date hoặc day) */}
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} />
                  <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
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
              <button className="text-gray-400 hover:text-gray-900"><MoreHorizontal size={20} /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cân nặng bắt đầu</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{weightMetrics.startWeight} <span className="text-sm font-bold text-gray-400">Kg</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cân nặng hiện tại</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{weightMetrics.currentWeight} <span className="text-sm font-bold text-gray-400">Kg</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mục tiêu cân nặng</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{weightMetrics.targetWeight} <span className="text-sm font-bold text-gray-400">Kg</span></p>
                </div>
              </div>

              <div className="md:col-span-3 h-[250px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weightHistory}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffcc80" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ffcc80" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                    {/* Cập nhật dataKey tương ứng với BE trả về (month hoặc date) */}
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} dy={10} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="weight" stroke="#ffcc80" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" dot={{ r: 4, fill: '#ffcc80', strokeWidth: 2, stroke: '#fff' }} />
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