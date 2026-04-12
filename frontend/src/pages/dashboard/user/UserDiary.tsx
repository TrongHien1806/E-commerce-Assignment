import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Plus, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Check,
  X,
  Flame,
  Utensils,
  Zap,
  Droplets,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { cn } from '@/lib/utils';

const initialDiaryEntries = [
  { id: 1, date: '11-04-2026', time: '7:30 AM', category: 'Bữa sáng', menu: 'Trứng xào rau bina & Bánh mì nguyên cám', amount: '2 Lát', cals: 300, carbs: 25, protein: 20, fats: 12, sugar: 3, thoughts: 'Năng lượng', checked: false },
  { id: 2, date: '11-04-2026', time: '12:30 PM', category: 'Bữa trưa', menu: 'Gà nướng Wrap với Bơ', amount: '1 Cái', cals: 450, carbs: 40, protein: 30, fats: 18, sugar: 4, thoughts: 'Khá hài lòng', checked: false },
  { id: 3, date: '10-04-2026', time: '4:00 PM', category: 'Ăn nhẹ', menu: 'Sữa yogurt Hy Lạp với Dâu tây', amount: '1 Hộp', cals: 200, carbs: 18, protein: 12, fats: 10, sugar: 16, thoughts: 'Khá hài lòng', checked: true },
  { id: 4, date: '10-04-2026', time: '7:00 PM', category: 'Bữa tối', menu: 'Burger phô mai và Khoai tây chiên', amount: '1 Phần', cals: 700, carbs: 55, protein: 35, fats: 35, sugar: 5, thoughts: 'Tội lỗi', checked: true },
  { id: 5, date: '09-04-2026', time: '8:00 AM', category: 'Bữa sáng', menu: 'Bánh mì bơ với Trứng chần', amount: '2 Lát', cals: 320, carbs: 30, protein: 14, fats: 18, sugar: 2, thoughts: 'Hài lòng', checked: false },
  { id: 6, date: '09-04-2026', time: '1:00 PM', category: 'Bữa trưa', menu: 'Salad Quinoa với Rau củ nướng & Phô mai Feta', amount: '1 Bát', cals: 450, carbs: 50, protein: 15, fats: 12, sugar: 6, thoughts: 'Khá hài lòng', checked: false },
  { id: 7, date: '08-04-2026', time: '3:30 PM', category: 'Ăn nhẹ', menu: 'Táo cắt lát với Bơ đậu phộng', amount: '1 Quả', cals: 200, carbs: 30, protein: 6, fats: 10, sugar: 19, thoughts: 'Năng lượng', checked: false },
  { id: 8, date: '08-04-2026', time: '6:30 PM', category: 'Bữa tối', menu: 'Mì Ý Alfredo với Bánh mì tỏi', amount: '1 Đĩa', cals: 650, carbs: 80, protein: 20, fats: 30, sugar: 4, thoughts: 'Không thoải mái', checked: false },
  { id: 9, date: '07-04-2026', time: '7:15 AM', category: 'Bữa sáng', menu: 'Sinh tố Protein Việt quất', amount: '1 Ly', cals: 300, carbs: 50, protein: 20, fats: 10, sugar: 24, thoughts: 'Năng lượng', checked: false },
  { id: 10, date: '07-04-2026', time: '12:00 PM', category: 'Bữa trưa', menu: 'Salad Hy Lạp với Feta và Ô liu', amount: '1 Bát', cals: 400, carbs: 40, protein: 12, fats: 20, sugar: 4, thoughts: 'Hài lòng', checked: false },
  { id: 11, date: '06-04-2026', time: '4:15 PM', category: 'Ăn nhẹ', menu: 'Hummus với Cà rốt que', amount: '1 Phần', cals: 180, carbs: 20, protein: 8, fats: 7, sugar: 2, thoughts: 'Khá hài lòng', checked: false },
  { id: 12, date: '06-04-2026', time: '7:00 PM', category: 'Bữa tối', menu: 'Bánh sô cô la và Kem', amount: '1 Phần', cals: 600, carbs: 75, protein: 8, fats: 25, sugar: 50, thoughts: 'Tội lỗi', checked: false },
  { id: 13, date: '05-04-2026', time: '7:30 AM', category: 'Bữa sáng', menu: 'Yến mạch qua đêm với Hạt chia', amount: '1 Hũ', cals: 350, carbs: 45, protein: 15, fats: 10, sugar: 8, thoughts: 'Năng lượng', checked: false },
  { id: 14, date: '05-04-2026', time: '12:30 PM', category: 'Bữa trưa', menu: 'Cơm gạo lứt Gà xào sả ớt', amount: '1 Đĩa', cals: 500, carbs: 60, protein: 35, fats: 15, sugar: 4, thoughts: 'Hài lòng', checked: false },
  { id: 15, date: '04-04-2026', time: '4:00 PM', category: 'Ăn nhẹ', menu: 'Hạnh nhân rang muối', amount: '1 Nắm', cals: 150, carbs: 5, protein: 6, fats: 14, sugar: 1, thoughts: 'Khá hài lòng', checked: false },
  { id: 16, date: '04-04-2026', time: '7:00 PM', category: 'Bữa tối', menu: 'Cá hồi áp chảo Măng tây', amount: '1 Phần', cals: 400, carbs: 10, protein: 30, fats: 25, sugar: 2, thoughts: 'Hài lòng', checked: false },
  { id: 17, date: '03-04-2026', time: '8:00 AM', category: 'Bữa sáng', menu: 'Phở bò truyền thống', amount: '1 Tô', cals: 450, carbs: 55, protein: 25, fats: 15, sugar: 3, thoughts: 'Hài lòng', checked: false },
  { id: 18, date: '03-04-2026', time: '1:00 PM', category: 'Bữa trưa', menu: 'Bún chả Hà Nội', amount: '1 Suất', cals: 600, carbs: 70, protein: 20, fats: 25, sugar: 15, thoughts: 'Khá hài lòng', checked: false },
  { id: 19, date: '02-04-2026', time: '4:30 PM', category: 'Ăn nhẹ', menu: 'Nước ép cam tươi', amount: '1 Ly', cals: 120, carbs: 28, protein: 2, fats: 0, sugar: 22, thoughts: 'Năng lượng', checked: false },
  { id: 20, date: '02-04-2026', time: '7:30 PM', category: 'Bữa tối', menu: 'Lẩu nấm chay', amount: '1 Phần', cals: 350, carbs: 40, protein: 15, fats: 10, sugar: 5, thoughts: 'Thoải mái', checked: false },
];

export default function UserDiary() {
  const [entries, setEntries] = useState(initialDiaryEntries);
  const [showFilter, setShowFilter] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedEntries, setSelectedEntries] = useState<number[]>([3, 4]);
  const [selectedDateRange, setSelectedDateRange] = useState('Tất cả thời gian');

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({
    key: '',
    direction: null
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(14);

  // Form state for adding food
  const [newFood, setNewFood] = useState({
    menu: '',
    category: 'Bữa sáng',
    amount: '',
    cals: '',
    carbs: '',
    protein: '',
    fats: '',
    sugar: '',
    thoughts: 'Hài lòng'
  });
  const [formError, setFormError] = useState('');

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const sortedEntries = useMemo(() => {
    const now = new Date();

    const filtered = entries.filter(entry => {
      const matchesSearch = entry.menu.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Tất cả' || entry.category === selectedCategory;
      
      let matchesDate = true;
      const [d, m, y] = entry.date.split('-').map(Number);
      const entryDate = new Date(y, m - 1, d);
      
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const compareDate = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());
      
      const diffTime = today.getTime() - compareDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (selectedDateRange === 'Hôm nay') {
        matchesDate = diffDays === 0;
      } else if (selectedDateRange === 'Hôm qua') {
        matchesDate = diffDays === 1;
      } else if (selectedDateRange === 'Tuần này') {
        matchesDate = diffDays >= 0 && diffDays < 7;
      } else if (selectedDateRange === 'Tháng này') {
        matchesDate = entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
      }

      return matchesSearch && matchesCategory && matchesDate;
    });

    if (!sortConfig.key || !sortConfig.direction) return filtered;

    return [...filtered].sort((a: any, b: any) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [entries, searchQuery, selectedCategory, sortConfig]);

  const totalPages = Math.ceil(sortedEntries.length / rowsPerPage);
  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedEntries.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedEntries, currentPage, rowsPerPage]);

  const toggleEntry = (id: number) => {
    setSelectedEntries(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddFood = () => {
    // Validation
    if (!newFood.menu.trim() || !newFood.amount.trim() || !newFood.cals) {
      setFormError('Vui lòng nhập đầy đủ Tên món, Khối lượng và Calories!');
      return;
    }
    
    if (newFood.menu.trim().length < 2) {
      setFormError('Tên món ăn phải có ít nhất 2 ký tự!');
      return;
    }

    if (Number(newFood.cals) <= 0) {
      setFormError('Calories phải lớn hơn 0!');
      return;
    }

    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('vi-VN').replace(/\//g, '-'),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      category: newFood.category,
      menu: newFood.menu,
      amount: newFood.amount,
      cals: Number(newFood.cals),
      carbs: Number(newFood.carbs) || 0,
      protein: Number(newFood.protein) || 0,
      fats: Number(newFood.fats) || 0,
      sugar: Number(newFood.sugar) || 0,
      thoughts: newFood.thoughts,
      checked: false
    };

    setEntries([entry, ...entries]);
    setShowAddModal(false);
    setNewFood({
      menu: '',
      category: 'Bữa sáng',
      amount: '',
      cals: '',
      carbs: '',
      protein: '',
      fats: '',
      sugar: '',
      thoughts: 'Hài lòng'
    });
    setFormError('');
  };

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar role="user" />
      
      <div className="flex-1 flex flex-col">
        <Header title="Nhật ký thực phẩm" userName="Nam" userRole="Người dùng" avatar="https://i.pravatar.cc/150?u=nam" hideSearch={true} />

        <main className="p-8 space-y-8 overflow-y-auto">
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

          {/* Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm món ăn" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 w-64 transition-all shadow-sm"
                />
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowFilter(!showFilter)}
                  className="flex items-center gap-2 bg-white border border-gray-100 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <Filter size={16} />
                  Lọc: {selectedCategory}
                  <ChevronDown size={14} className={cn("transition-transform", showFilter && "rotate-180")} />
                </button>
                {showFilter && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-30 animate-in fade-in slide-in-from-top-2">
                    {['Tất cả', 'Bữa sáng', 'Bữa trưa', 'Ăn nhẹ', 'Bữa tối'].map(cat => (
                      <button 
                        key={cat} 
                        onClick={() => {
                          setSelectedCategory(cat);
                          setShowFilter(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-colors",
                          selectedCategory === cat ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setShowDateRange(!showDateRange)}
                  className="flex items-center gap-2 bg-white border border-gray-100 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <Calendar size={16} />
                  {selectedDateRange}
                  <ChevronDown size={14} className={cn("transition-transform", showDateRange && "rotate-180")} />
                </button>
                {showDateRange && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-30 animate-in fade-in slide-in-from-top-2">
                    {['Hôm nay', 'Hôm qua', 'Tuần này', 'Tháng này', 'Tất cả thời gian'].map(range => (
                      <button 
                        key={range} 
                        onClick={() => {
                          setSelectedDateRange(range);
                          setShowDateRange(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-colors",
                          selectedDateRange === range ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-[#c1e06d] text-gray-900 px-6 py-2.5 rounded-xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-[#c1e06d]/20"
              >
                <Plus size={18} />
                Thêm món
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                    <th className="p-6 w-12">
                      <div className="w-5 h-5 border-2 border-gray-200 rounded-md flex items-center justify-center bg-gray-100">
                        <div className="w-2 h-0.5 bg-gray-400 rounded-full" />
                      </div>
                    </th>
                    <th className="py-6 px-4 cursor-pointer hover:text-gray-900 transition-colors" onClick={() => handleSort('date')}>
                      Ngày & Giờ {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} className="inline" /> : <ArrowDown size={12} className="inline" />) : <ArrowUpDown size={12} className="inline opacity-30" />}
                    </th>
                    <th className="py-6 px-4 cursor-pointer hover:text-gray-900 transition-colors" onClick={() => handleSort('category')}>
                      Danh mục {sortConfig.key === 'category' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} className="inline" /> : <ArrowDown size={12} className="inline" />) : <ArrowUpDown size={12} className="inline opacity-30" />}
                    </th>
                    <th className="py-6 px-4 cursor-pointer hover:text-gray-900 transition-colors" onClick={() => handleSort('menu')}>
                      Thực đơn {sortConfig.key === 'menu' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} className="inline" /> : <ArrowDown size={12} className="inline" />) : <ArrowUpDown size={12} className="inline opacity-30" />}
                    </th>
                    <th className="py-6 px-4 cursor-pointer hover:text-gray-900 transition-colors" onClick={() => handleSort('amount')}>
                      Khối lượng {sortConfig.key === 'amount' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} className="inline" /> : <ArrowDown size={12} className="inline" />) : <ArrowUpDown size={12} className="inline opacity-30" />}
                    </th>
                    <th className="py-6 px-4 cursor-pointer hover:text-gray-900 transition-colors" onClick={() => handleSort('cals')}>
                      Cals {sortConfig.key === 'cals' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} className="inline" /> : <ArrowDown size={12} className="inline" />) : <ArrowUpDown size={12} className="inline opacity-30" />}
                    </th>
                    <th className="py-6 px-4 text-center border-x border-gray-50">
                      <p className="mb-1">Macronutrients</p>
                      <div className="grid grid-cols-3 gap-2 text-[8px]">
                        <span className="cursor-pointer hover:text-gray-900" onClick={() => handleSort('carbs')}>Carbs</span>
                        <span className="cursor-pointer hover:text-gray-900" onClick={() => handleSort('protein')}>Protein</span>
                        <span className="cursor-pointer hover:text-gray-900" onClick={() => handleSort('fats')}>Fats</span>
                      </div>
                    </th>
                    <th className="py-6 px-4 cursor-pointer hover:text-gray-900 transition-colors" onClick={() => handleSort('sugar')}>
                      Đường {sortConfig.key === 'sugar' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} className="inline" /> : <ArrowDown size={12} className="inline" />) : <ArrowUpDown size={12} className="inline opacity-30" />}
                    </th>
                    <th className="py-6 px-4 cursor-pointer hover:text-gray-900 transition-colors" onClick={() => handleSort('thoughts')}>
                      Cảm nhận {sortConfig.key === 'thoughts' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} className="inline" /> : <ArrowDown size={12} className="inline" />) : <ArrowUpDown size={12} className="inline opacity-30" />}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedEntries.length > 0 ? paginatedEntries.map((entry) => (
                    <tr key={entry.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="p-6">
                        <button 
                          onClick={() => toggleEntry(entry.id)}
                          className={cn(
                            "w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all",
                            selectedEntries.includes(entry.id) 
                              ? "bg-[#c1e06d] border-[#c1e06d]" 
                              : "border-gray-200 bg-white"
                          )}
                        >
                          {selectedEntries.includes(entry.id) && <Check size={12} className="text-gray-900" />}
                        </button>
                      </td>
                      <td className="py-6 px-4">
                        <p className="text-sm font-bold text-gray-900">{entry.date}</p>
                        <p className="text-[10px] font-bold text-gray-400">{entry.time}</p>
                      </td>
                      <td className="py-6 px-4">
                        <span className={cn(
                          "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                          entry.category === 'Bữa sáng' && "bg-[#d4e157]/20 text-[#827717]",
                          entry.category === 'Bữa trưa' && "bg-[#ffd54f]/20 text-[#f57f17]",
                          entry.category === 'Ăn nhẹ' && "bg-[#ffab91]/20 text-[#e64a19]",
                          entry.category === 'Bữa tối' && "bg-[#e0e0e0] text-gray-600"
                        )}>
                          {entry.category}
                        </span>
                      </td>
                      <td className="py-6 px-4 max-w-[200px]">
                        <p className="text-sm font-bold text-gray-900 leading-tight">{entry.menu}</p>
                      </td>
                      <td className="py-6 px-4 text-sm font-bold text-gray-500">{entry.amount}</td>
                      <td className="py-6 px-4 text-sm font-black text-gray-900">{entry.cals} <span className="text-[10px] text-gray-400 font-bold uppercase">kcal</span></td>
                      <td className="py-6 px-4 border-x border-gray-50">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <span className="text-sm font-bold text-gray-900">{entry.carbs} <span className="text-[10px] text-gray-400">gr</span></span>
                          <span className="text-sm font-bold text-gray-900">{entry.protein} <span className="text-[10px] text-gray-400">gr</span></span>
                          <span className="text-sm font-bold text-gray-900">{entry.fats} <span className="text-[10px] text-gray-400">gr</span></span>
                        </div>
                      </td>
                      <td className="py-6 px-4 text-sm font-bold text-gray-900">{entry.sugar} <span className="text-[10px] text-gray-400">gr</span></td>
                      <td className="py-6 px-4">
                        <span className={cn(
                          "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 w-fit",
                          entry.thoughts === 'Năng lượng' && "bg-orange-50 text-orange-600",
                          entry.thoughts === 'Khá hài lòng' && "bg-green-50 text-green-700",
                          entry.thoughts === 'Tội lỗi' && "bg-red-50 text-red-600",
                          entry.thoughts === 'Hài lòng' && "bg-green-50 text-green-600",
                          entry.thoughts === 'Không thoải mái' && "bg-stone-100 text-stone-600"
                        )}>
                          <div className="w-4 h-4 rounded-lg bg-white/50 flex items-center justify-center">
                            <Check size={10} />
                          </div>
                          {entry.thoughts}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={9} className="p-20 text-center">
                        <p className="text-gray-400 font-bold">Không tìm thấy món ăn nào khớp với yêu cầu.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-8 flex items-center justify-between border-t border-gray-50 bg-white">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-400">Đang hiển thị</span>
                <div className="relative">
                  <select 
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 pr-10 text-sm font-bold text-gray-900 outline-none cursor-pointer"
                  >
                    <option value={14}>14</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <span className="text-sm font-bold text-gray-400">
                  trên tổng số {sortedEntries.length} món ăn
                  {sortedEntries.length > 0 && ` (Trang ${currentPage}/${totalPages})`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-300 hover:text-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                    return (
                      <button 
                        key={i}
                        onClick={() => setCurrentPage(p)}
                        className={cn(
                          "w-10 h-10 rounded-xl text-sm font-black transition-all",
                          p === currentPage ? "bg-[#c1e06d] text-gray-900 shadow-lg shadow-[#c1e06d]/20" : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        {p}
                      </button>
                    );
                  }
                  if (p === currentPage - 2 || p === currentPage + 2) {
                    return <span key={i} className="text-gray-300 px-1">..</span>;
                  }
                  return null;
                })}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-300 hover:text-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Food Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-[40px] shadow-2xl max-w-md w-full p-8 space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-gray-900">Thêm món ăn</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-all">
                <X size={24} />
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
                <AlertCircle size={18} />
                {formError}
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tên món ăn</label>
                <input 
                  type="text" 
                  placeholder="Bạn đã ăn gì?" 
                  value={newFood.menu}
                  onChange={(e) => setNewFood({...newFood, menu: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Danh mục</label>
                  <select 
                    value={newFood.category}
                    onChange={(e) => setNewFood({...newFood, category: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold appearance-none"
                  >
                    <option>Bữa sáng</option>
                    <option>Bữa trưa</option>
                    <option>Ăn nhẹ</option>
                    <option>Bữa tối</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Khối lượng</label>
                  <input 
                    type="text" 
                    placeholder="VD: 1 Bát" 
                    value={newFood.amount}
                    onChange={(e) => setNewFood({...newFood, amount: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Calories (kcal)</label>
                  <input 
                    type="number" 
                    placeholder="kcal" 
                    value={newFood.cals}
                    onChange={(e) => setNewFood({...newFood, cals: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cảm nhận</label>
                  <select 
                    value={newFood.thoughts}
                    onChange={(e) => setNewFood({...newFood, thoughts: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold appearance-none"
                  >
                    <option>Năng lượng</option>
                    <option>Hài lòng</option>
                    <option>Khá hài lòng</option>
                    <option>Tội lỗi</option>
                    <option>Không thoải mái</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Carbs (gr)</label>
                  <input 
                    type="number" 
                    value={newFood.carbs}
                    onChange={(e) => setNewFood({...newFood, carbs: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Protein (gr)</label>
                  <input 
                    type="number" 
                    value={newFood.protein}
                    onChange={(e) => setNewFood({...newFood, protein: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fats (gr)</label>
                  <input 
                    type="number" 
                    value={newFood.fats}
                    onChange={(e) => setNewFood({...newFood, fats: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-sm" 
                  />
                </div>
              </div>

              <button 
                onClick={handleAddFood}
                className="w-full py-5 bg-[#c1e06d] text-gray-900 rounded-3xl font-black text-lg shadow-xl shadow-[#c1e06d]/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Lưu món ăn
              </button>
            </div>
          </div>
        </div>
      )}
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
