import { useState, useMemo } from 'react';
import { 
  Search, 
  Clock, 
  Truck, 
  ChefHat, 
  CheckCircle2, 
  MoreVertical,
  Filter,
  ArrowRight
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { cn } from '@/lib/utils';

const initialOrders = [
  { id: 'ORD-1234', customer: 'Nguyễn Văn An', items: ['Salad ức gà x2', 'Nước ép cam'], status: 'Pending', time: '10:30 AM', total: '150.000 đ' },
  { id: 'ORD-1235', customer: 'Trần Thị Bình', items: ['Cơm gạo lứt thịt heo'], status: 'Cooking', time: '10:45 AM', total: '65.000 đ' },
  { id: 'ORD-1236', customer: 'Lê Văn Cường', items: ['Bánh mì ngũ cốc x3'], status: 'Delivering', time: '11:00 AM', total: '120.000 đ' },
  { id: 'ORD-1237', customer: 'Phạm Minh Đức', items: ['Sữa chua yến mạch'], status: 'Completed', time: '09:15 AM', total: '45.000 đ' },
  { id: 'ORD-1238', customer: 'Hoàng Anh Tuấn', items: ['Salad ức gà', 'Cơm thịt bò'], status: 'Pending', time: '11:15 AM', total: '115.000 đ' },
];

const columns = [
  { id: 'Pending', title: 'Chờ xử lý', icon: <Clock size={18} />, color: 'bg-orange-500' },
  { id: 'Cooking', title: 'Đang chế biến', icon: <ChefHat size={18} />, color: 'bg-blue-500' },
  { id: 'Delivering', title: 'Đang giao hàng', icon: <Truck size={18} />, color: 'bg-purple-500' },
  { id: 'Completed', title: 'Hoàn tất', icon: <CheckCircle2 size={18} />, color: 'bg-green-500' },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter(order => 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [orders, searchQuery]);

  const moveOrder = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col">
        <Header title="Quản lý Đơn hàng" userRole="Quản trị viên" hideSearch={true} />
        
        <main className="p-8 space-y-8 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Tìm mã đơn, khách hàng..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c1e06d]/20 w-80"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all">
                <Filter size={16} />
                Bộ lọc
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cập nhật thời gian thực đang bật</span>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[600px]">
            {columns.map((column) => (
              <div key={column.id} className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", column.color)} />
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">{column.title}</h3>
                    <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {filteredOrders.filter(o => o.status === column.id).length}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-900">
                    <MoreVertical size={16} />
                  </button>
                </div>

                <div className="flex-1 bg-gray-100/50 rounded-[32px] p-4 space-y-4 border-2 border-dashed border-gray-200">
                  {filteredOrders.filter(o => o.status === column.id).map((order) => (
                    <div 
                      key={order.id} 
                      className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 space-y-4 group hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-wider">
                          {order.id}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">{order.time}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-black text-gray-900">{order.customer}</p>
                        <div className="space-y-0.5">
                          {order.items.map((item, i) => (
                            <p key={i} className="text-[10px] font-medium text-gray-500">• {item}</p>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                        <p className="text-sm font-black text-gray-900">{order.total}</p>
                        <div className="flex gap-1">
                          {column.id === 'Pending' && (
                            <button 
                              onClick={() => moveOrder(order.id, 'Cooking')}
                              className="p-2 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                              title="Chuyển sang Chế biến"
                            >
                              <ArrowRight size={14} />
                            </button>
                          )}
                          {column.id === 'Cooking' && (
                            <button 
                              onClick={() => moveOrder(order.id, 'Delivering')}
                              className="p-2 bg-purple-50 text-purple-500 rounded-xl hover:bg-purple-500 hover:text-white transition-all"
                              title="Chuyển sang Giao hàng"
                            >
                              <ArrowRight size={14} />
                            </button>
                          )}
                          {column.id === 'Delivering' && (
                            <button 
                              onClick={() => moveOrder(order.id, 'Completed')}
                              className="p-2 bg-green-50 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all"
                              title="Hoàn tất đơn hàng"
                            >
                              <CheckCircle2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
