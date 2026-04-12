import { useState, useMemo, FormEvent } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Clock, 
  Flame, 
  ChevronRight,
  Utensils,
  CheckCircle2,
  Users,
  X,
  Image as ImageIcon
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const initialMenus = [
  { 
    id: 1, 
    name: 'Thực đơn Giảm mỡ Cấp tốc', 
    calories: 1500, 
    protein: '120g', 
    carbs: '150g', 
    fats: '45g', 
    students: 12,
    image: 'https://picsum.photos/seed/salad/400/300',
    tags: ['Ít Carb', 'Giàu Protein'],
    isAssigned: true
  },
  { 
    id: 2, 
    name: 'Thực đơn Tăng cơ Lean Bulk', 
    calories: 2800, 
    protein: '180g', 
    carbs: '350g', 
    fats: '70g', 
    students: 8,
    image: 'https://picsum.photos/seed/steak/400/300',
    tags: ['Nhiều Calo', 'Tăng cơ'],
    isAssigned: true
  },
  { 
    id: 3, 
    name: 'Chế độ Ăn chay Linh hoạt', 
    calories: 1800, 
    protein: '90g', 
    carbs: '250g', 
    fats: '50g', 
    students: 5,
    image: 'https://picsum.photos/seed/vegan/400/300',
    tags: ['Ăn chay', 'Cân bằng'],
    isAssigned: false
  },
  { 
    id: 4, 
    name: 'Keto Standard Plan', 
    calories: 1600, 
    protein: '100g', 
    carbs: '30g', 
    fats: '120g', 
    students: 15,
    image: 'https://picsum.photos/seed/keto/400/300',
    tags: ['Keto', 'Giảm mỡ'],
    isAssigned: false
  },
];

export default function PTMenu() {
  const [menus, setMenus] = useState(initialMenus);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New menu form state
  const [newMenu, setNewMenu] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    tags: ''
  });

  const filteredMenus = useMemo(() => {
    return menus.filter(menu => {
      const matchesSearch = menu.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'all' || (activeTab === 'assigned' && menu.isAssigned);
      return matchesSearch && matchesTab;
    });
  }, [menus, searchQuery, activeTab]);

  const handleAddMenu = (e: FormEvent) => {
    e.preventDefault();
    if (!newMenu.name) return;

    const menuToAdd = {
      id: Date.now(),
      name: newMenu.name,
      calories: parseInt(newMenu.calories) || 0,
      protein: newMenu.protein + 'g',
      carbs: newMenu.carbs + 'g',
      fats: newMenu.fats + 'g',
      students: 0,
      image: `https://picsum.photos/seed/${Date.now()}/400/300`,
      tags: newMenu.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      isAssigned: false
    };

    setMenus([menuToAdd, ...menus]);
    setShowAddModal(false);
    setNewMenu({ name: '', calories: '', protein: '', carbs: '', fats: '', tags: '' });
  };

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar role="pt" />
      
      <div className="flex-1 flex flex-col">
        <Header title="Quản lý thực đơn" userRole="Huấn luyện viên" avatar="https://i.pravatar.cc/150?u=pt" hideSearch={true} />
        
        <main className="p-8 space-y-8 overflow-y-auto">
          {/* Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-2 bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
              <button 
                onClick={() => setActiveTab('all')}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                  activeTab === 'all' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-gray-400 hover:text-gray-600"
                )}
              >
                Tất cả thực đơn
              </button>
              <button 
                onClick={() => setActiveTab('assigned')}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                  activeTab === 'assigned' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-gray-400 hover:text-gray-600"
                )}
              >
                Đang áp dụng
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm thực đơn..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 w-64 transition-all shadow-sm"
                />
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-200"
              >
                <Plus size={20} />
                Tạo thực đơn mới
              </button>
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {filteredMenus.map((menu) => (
              <div key={menu.id} className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-50 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={menu.image} 
                    alt={menu.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {menu.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[9px] font-black text-indigo-600 uppercase tracking-wider shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors shadow-sm">
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">{menu.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 text-orange-500">
                        <Flame size={14} />
                        <span className="text-sm font-black">{menu.calories}</span>
                      </div>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-tighter">kcal / ngày</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-50">
                    <div className="text-center">
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Protein</p>
                      <p className="text-xs font-black text-gray-900">{menu.protein}</p>
                    </div>
                    <div className="text-center border-x border-gray-50">
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Carbs</p>
                      <p className="text-xs font-black text-gray-900">{menu.carbs}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Fats</p>
                      <p className="text-xs font-black text-gray-900">{menu.fats}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <img key={i} src={`https://i.pravatar.cc/100?u=${menu.id + i}`} className="w-6 h-6 rounded-full border-2 border-white object-cover" alt="Student" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">+{menu.students} học viên</span>
                    </div>
                    <button className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredMenus.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 font-bold">Không tìm thấy thực đơn phù hợp...</p>
            </div>
          )}
        </main>
      </div>

      {/* Add Menu Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-[40px] shadow-2xl max-w-lg w-full p-8 space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-gray-900">Tạo thực đơn mới</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddMenu} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tên thực đơn</label>
                <input 
                  type="text" 
                  required
                  value={newMenu.name}
                  onChange={(e) => setNewMenu({...newMenu, name: e.target.value})}
                  placeholder="VD: Thực đơn tăng cơ 30 ngày..." 
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Calories (kcal)</label>
                  <div className="relative">
                    <Flame className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="number" 
                      value={newMenu.calories}
                      onChange={(e) => setNewMenu({...newMenu, calories: e.target.value})}
                      placeholder="2000" 
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tags (cách nhau bằng dấu phẩy)</label>
                  <input 
                    type="text" 
                    value={newMenu.tags}
                    onChange={(e) => setNewMenu({...newMenu, tags: e.target.value})}
                    placeholder="Low Carb, Keto..." 
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Protein (g)</label>
                  <input 
                    type="number" 
                    value={newMenu.protein}
                    onChange={(e) => setNewMenu({...newMenu, protein: e.target.value})}
                    placeholder="150" 
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Carbs (g)</label>
                  <input 
                    type="number" 
                    value={newMenu.carbs}
                    onChange={(e) => setNewMenu({...newMenu, carbs: e.target.value})}
                    placeholder="200" 
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fats (g)</label>
                  <input 
                    type="number" 
                    value={newMenu.fats}
                    onChange={(e) => setNewMenu({...newMenu, fats: e.target.value})}
                    placeholder="60" 
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold" 
                  />
                </div>
              </div>

              <Button type="submit" className="w-full py-8 bg-indigo-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all">
                Tạo thực đơn
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
