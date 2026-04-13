import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Utensils, Users, ClipboardList, 
  Settings, LogOut, ShoppingBag, BarChart3, MessageSquare 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  role?: 'admin' | 'pt' | 'user' | 'Admin' | 'PT' | 'Customer';
}

export default function Sidebar({ role }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  // 1. Định nghĩa menu cho Khách hàng
  const customerLinks = [
    { icon: LayoutDashboard, label: 'Tổng quan', path: '/dashboard/user' },
    { icon: Utensils, label: 'Thực đơn của tôi', path: '/dashboard/menu' },
    { icon: ClipboardList, label: 'Nhật ký thực phẩm', path: '/dashboard/diary' },
    { icon: Users, label: 'Huấn luyện viên', path: '/dashboard/pt' },
  ];

  // 2. Định nghĩa menu cho PT
  const ptLinks = [
    { icon: LayoutDashboard, label: 'Dashboard PT', path: '/dashboard/pt-view' },
    { icon: Utensils, label: 'Quản lý thực đơn', path: '/dashboard/pt/menu' },
    { icon: MessageSquare, label: 'Học viên & Chat', path: '/dashboard/pt/chat' },
  ];

  // 3. Định nghĩa menu cho Admin
  const adminLinks = [
    { icon: LayoutDashboard, label: 'Quản trị hệ thống', path: '/dashboard/admin' },
    { icon: Users, label: 'Quản lý người dùng', path: '/dashboard/admin/users' },
    { icon: ShoppingBag, label: 'Quản lý đơn hàng', path: '/dashboard/admin/orders' },
    { icon: BarChart3, label: 'Thống kê tài chính', path: '/dashboard/admin/analytics' },
  ];

  const normalizedRole = role?.toLowerCase() === 'admin'
    ? 'Admin'
    : role?.toLowerCase() === 'pt'
      ? 'PT'
      : role?.toLowerCase() === 'user'
        ? 'Customer'
        : user?.role;

  // Lựa chọn bộ menu dựa trên Role
  const activeLinks = normalizedRole === 'Admin' ? adminLinks : normalizedRole === 'PT' ? ptLinks : customerLinks;

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Utensils className="text-white" size={20} />
          </div>
          <span className="text-xl font-black text-gray-900 italic">FitBite</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {activeLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
              location.pathname === link.path
                ? "bg-orange-50 text-orange-500"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <link.icon size={20} />
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut size={20} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}