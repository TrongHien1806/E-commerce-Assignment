import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Utensils, 
  BookOpen, 
  Users, 
  LogOut,
  User,
  Settings,
  ShoppingBag,
  BarChart3,
  CreditCard,
  DollarSign,
  Receipt,
  PieChart,
  ClipboardList,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  role: 'user' | 'admin' | 'pt';
}

export default function Sidebar({ role }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any auth tokens/state here
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const menuItems = {
    user: [
      { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard/user' },
      { name: 'Thực đơn sức khỏe', icon: <Utensils size={20} />, path: '/dashboard/menu' },
      { name: 'Nhật ký thực phẩm', icon: <BookOpen size={20} />, path: '/dashboard/diary' },
      { name: 'Huấn luyện viên', icon: <Users size={20} />, path: '/dashboard/pt' },
    ],
    admin: [
      { name: 'Báo cáo Thống kê', icon: <BarChart3 size={20} />, path: '/dashboard/admin/analytics' },
      { name: 'Quản lý món ăn', icon: <Utensils size={20} />, path: '/dashboard/admin/menu' },
      { name: 'Quản lý PT', icon: <Users size={20} />, path: '/dashboard/admin/pt' },
      { name: 'Quản lý Đơn hàng', icon: <ClipboardList size={20} />, path: '/dashboard/admin/orders' },
      { 
        type: 'group',
        name: 'Quản lý Tài chính',
        icon: <DollarSign size={20} />,
        items: [
          { name: 'Doanh thu', icon: <TrendingUp size={16} />, path: '/dashboard/admin/finance/revenue' },
          { name: 'Chi phí', icon: <TrendingDown size={16} />, path: '/dashboard/admin/finance/expenses' },
          { name: 'Báo cáo Lãi/Lỗ', icon: <PieChart size={16} />, path: '/dashboard/admin' },
          { name: 'Thanh toán PT', icon: <CreditCard size={16} />, path: '/dashboard/admin/finance/payouts' },
          { name: 'Hóa đơn & GD', icon: <Receipt size={16} />, path: '/dashboard/admin/finance/transactions' },
        ]
      }
    ],
    pt: [
      { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard/pt-view' },
      { name: 'Thực đơn', icon: <Utensils size={20} />, path: '/dashboard/pt/menu' },
      { name: 'Hồ sơ học viên', icon: <User size={20} />, path: '/dashboard/pt/profile' },
    ]
  };

  const currentMenu = menuItems[role];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-50 flex flex-col sticky top-0 overflow-y-auto">
      <div className="p-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <Utensils size={20} />
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tighter">FitBite</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {currentMenu.map((item: any, idx: number) => {
          if (item.type === 'group') {
            return (
              <div key={idx} className="space-y-1 pt-4">
                <div className="px-4 py-2 flex items-center gap-3 text-gray-400">
                  {item.icon}
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                </div>
                {item.items.map((subItem: any) => (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group",
                      location.pathname === subItem.path
                        ? "bg-[#c1e06d]/20 text-gray-900 border border-[#c1e06d]/30"
                        : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <span className={cn(
                      "transition-colors",
                      location.pathname === subItem.path ? "text-gray-900" : "text-gray-400 group-hover:text-gray-900"
                    )}>
                      {subItem.icon}
                    </span>
                    <span className="text-xs font-bold">{subItem.name}</span>
                  </Link>
                ))}
              </div>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 group",
                location.pathname === item.path
                  ? "bg-[#c1e06d] text-gray-900 shadow-lg shadow-[#c1e06d]/20"
                  : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn(
                  "transition-colors",
                  location.pathname === item.path ? "text-gray-900" : "text-gray-400 group-hover:text-gray-900"
                )}>
                  {item.icon}
                </span>
                <span className="text-sm font-bold">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <button 
          onClick={handleLogout}
          className="w-full mt-6 flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
        >
          <LogOut size={20} />
          <span className="text-sm font-bold">Logout</span>
        </button>
      </div>
    </aside>
  );
}
