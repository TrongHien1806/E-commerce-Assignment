import { useState, useMemo, FormEvent } from 'react';
import { Search, Plus, MoreVertical, Edit2, Trash2, CheckCircle2, Clock, Truck, ChefHat, ChevronDown, X } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const kitchenOrders = [
  { 
    id: 'TXN12', 
    name: 'Sữa chua Hy Lạp với Ngũ cốc và Mật ong', 
    qty: 2, 
    note: 'cay', 
    status: 'Đang chuẩn bị', 
    deliveryStatus: 'Chờ giao',
    image: 'https://picsum.photos/seed/yogurt/100/100'
  },
  { 
    id: 'TXN24', 
    name: 'Cá hồi nướng Chanh và Măng tây', 
    qty: 2, 
    status: 'Đã xác nhận', 
    deliveryStatus: 'Đang giao',
    image: 'https://picsum.photos/seed/salmon/100/100'
  },
  { 
    id: 'TXN45', 
    name: 'Salad Hy Lạp với Phô mai Feta và Oliu', 
    qty: 1, 
    name2: 'Salad Diêm mạch với Rau củ nướng và Phô mai Feta',
    qty2: 2,
    status: 'Đã xác nhận', 
    deliveryStatus: 'Đang giao',
    image: 'https://picsum.photos/seed/salad/100/100'
  }
];

const initialFoodItems = [
  { 
    id: 'PROD-1013', 
    name: 'Salad ức gà', 
    price: '50.000 đ', 
    status: 'Đang bán', 
    inventory: 80, 
    nutrition: { protein: '2.9 kcal / 10.7 gr', carb: 'Carb 5gr / Fat gr' },
    image: 'https://picsum.photos/seed/salad/100/100'
  },
  { 
    id: 'PROD-1015', 
    name: 'Cơm gạo lứt thịt heo', 
    price: '50.000 đ', 
    status: 'Đang bán', 
    inventory: 20, 
    nutrition: { protein: '2.9 kcal / 10.3 gr', carb: 'Carb 3gr / Fat gr' },
    image: 'https://picsum.photos/seed/rice/100/100'
  },
  { 
    id: 'PROD-1013-2', 
    name: 'Bánh mì ngũ cốc', 
    price: '50.000 đ', 
    status: 'Đã ẩn', 
    inventory: 3, 
    nutrition: { protein: '2.9 kcal / 10.3 gr', carb: 'Carb 5gr / Fat gr' },
    image: 'https://picsum.photos/seed/bread/100/100'
  },
  { 
    id: 'PROD-1013-3', 
    name: 'Sữa chua yến mạch', 
    price: '50.000 đ', 
    status: 'Đã ẩn', 
    inventory: 6, 
    nutrition: { protein: '2.9 kcal / 10.3 gr', carb: 'Carb 5gr / Fat gr' },
    image: 'https://picsum.photos/seed/yogurt/100/100'
  },
];

export default function AdminMenu() {
  const [foodItems, setFoodItems] = useState(initialFoodItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    price: '',
    inventory: '',
    protein: '',
    carb: ''
  });

  const filteredFoodItems = useMemo(() => {
    return foodItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && item.status === 'Đang bán') ||
                           (statusFilter === 'inactive' && item.status === 'Đã ẩn');
      return matchesSearch && matchesStatus;
    });
  }, [foodItems, searchQuery, statusFilter]);

  const toggleStatus = (id: string) => {
    setFoodItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: item.status === 'Đang bán' ? 'Đã ẩn' : 'Đang bán' } 
        : item
    ));
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      id: item.id,
      price: item.price,
      inventory: item.inventory.toString(),
      protein: item.nutrition.protein,
      carb: item.nutrition.carb
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: FormEvent) => {
    e.preventDefault();
    setFoodItems(prev => prev.map(item => 
      item.id === editingItem.id 
        ? { 
            ...item, 
            name: formData.name,
            id: formData.id,
            price: formData.price,
            inventory: parseInt(formData.inventory) || 0,
            nutrition: {
              protein: formData.protein,
              carb: formData.carb
            }
          } 
        : item
    ));
    setShowEditModal(false);
  };

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col">
        <Header title="Quản lý Bếp & Giao hàng" userName="NGÔ MỸ LAN" userRole="Quản trị viên" hideSearch={true} />
        
        <main className="p-8 space-y-10 overflow-y-auto">
          {/* Kitchen & Delivery Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-gray-900">Màn hình bếp & Theo dõi giao hàng</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {kitchenOrders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex gap-4 relative">
                  <img src={order.image} alt={order.name} className="w-20 h-20 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold text-gray-900 pr-8">{order.name}</h3>
                      <span className="text-xs font-black text-gray-400">x{order.qty}</span>
                    </div>
                    {order.name2 && (
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold text-gray-900 pr-8">{order.name2}</h3>
                        <span className="text-xs font-black text-gray-400">x{order.qty2}</span>
                      </div>
                    )}
                    {order.note && <p className="text-[10px] font-bold text-gray-400 italic">Ghi chú: {order.note}</p>}
                    <p className="text-[10px] font-black text-gray-900">Mã đơn {order.id}</p>
                    <p className="text-[10px] font-bold text-gray-400">{order.status === 'Đang chuẩn bị' ? 'Đang chuẩn bị...' : 'Đang nấu...'}</p>
                    
                    <div className="flex gap-2 mt-4">
                      <span className={cn(
                        "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider",
                        order.status === 'Đang chuẩn bị' ? "bg-blue-500 text-white" : "bg-blue-500 text-white"
                      )}>
                        {order.status === 'Đang chuẩn bị' ? 'ĐANG NẤU' : 'ĐÃ XÁC NHẬN'}
                      </span>
                      <span className={cn(
                        "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider",
                        order.deliveryStatus === 'Chờ giao' ? "bg-red-100 text-red-500" : 
                        order.deliveryStatus === 'Đang giao' ? (order.status === 'Đã xác nhận' ? "bg-blue-100 text-blue-500" : "bg-red-100 text-red-500") : ""
                      )}>
                        {order.deliveryStatus === 'Chờ giao' ? 'CHỜ GIAO' : 'ĐANG GIAO'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Food Management Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 uppercase">Quản lý món ăn</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c1e06d]/20"
                  />
                </div>
                <div className="relative">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c1e06d]/20 font-medium text-gray-600"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Đang bán (Active)</option>
                    <option value="inactive">Đã ẩn (Inactive)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 bg-gray-50/30">
                    <th className="p-6">Sản phẩm gần đây</th>
                    <th className="p-6">Giá bán</th>
                    <th className="p-6">Dinh dưỡng</th>
                    <th className="p-6">Tồn kho</th>
                    <th className="p-6">Trạng thái (Status)</th>
                    <th className="p-6">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredFoodItems.map((item) => (
                    <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                          <div>
                            <p className="text-sm font-bold text-gray-900">{item.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">{item.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-sm font-black text-gray-900">{item.price}</td>
                      <td className="p-6">
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-gray-900 font-bold">
                            <span className="text-gray-900">Protein</span> / {item.nutrition.protein}
                          </p>
                          <p className="text-[10px] text-gray-500 font-medium">
                            Carbin / {item.nutrition.carb}
                          </p>
                        </div>
                      </td>
                      <td className="p-6 text-sm font-bold text-gray-500">{item.inventory}</td>
                      <td className="p-6">
                        <span className={cn(
                          "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-wider inline-block min-w-[100px] text-center",
                          item.status === 'Đang bán' ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-500"
                        )}>
                          {item.status === 'Đang bán' ? 'ĐANG BÁN' : 'ĐÃ ẨN'}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => toggleStatus(item.id)}
                            className={cn(
                              "relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none",
                              item.status === 'Đang bán' ? "bg-[#c1e06d]" : "bg-gray-300"
                            )}
                          >
                            <div className={cn(
                              "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200",
                              item.status === 'Đang bán' ? "translate-x-6" : "translate-x-0"
                            )} />
                          </button>
                          <button 
                            onClick={() => handleOpenEdit(item)}
                            className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredFoodItems.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 font-bold">Không tìm thấy món ăn phù hợp...</p>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-white rounded-[40px] shadow-2xl max-w-lg w-full p-8 space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-gray-900">Chỉnh sửa món ăn</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tên món ăn</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#c1e06d] focus:bg-white rounded-2xl outline-none transition-all font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mã sản phẩm</label>
                  <input 
                    type="text" 
                    required
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#c1e06d] focus:bg-white rounded-2xl outline-none transition-all font-bold" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Giá bán</label>
                  <input 
                    type="text" 
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#c1e06d] focus:bg-white rounded-2xl outline-none transition-all font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tồn kho</label>
                  <input 
                    type="number" 
                    required
                    value={formData.inventory}
                    onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#c1e06d] focus:bg-white rounded-2xl outline-none transition-all font-bold" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thông số dinh dưỡng</p>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400">Protein / Calories / Gram</label>
                    <input 
                      type="text" 
                      value={formData.protein}
                      onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                      placeholder="VD: 2.9 kcal / 10.7 gr"
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#c1e06d] focus:bg-white rounded-2xl outline-none transition-all font-bold text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400">Carbin / Carb / Fat</label>
                    <input 
                      type="text" 
                      value={formData.carb}
                      onChange={(e) => setFormData({ ...formData, carb: e.target.value })}
                      placeholder="VD: Carb 5gr / Fat gr"
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#c1e06d] focus:bg-white rounded-2xl outline-none transition-all font-bold text-sm" 
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full py-8 bg-[#c1e06d] text-gray-900 rounded-3xl font-black text-lg shadow-xl shadow-[#c1e06d]/20 hover:bg-[#b1d05d] hover:scale-[1.02] active:scale-95 transition-all">
                Lưu chỉnh sửa
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
