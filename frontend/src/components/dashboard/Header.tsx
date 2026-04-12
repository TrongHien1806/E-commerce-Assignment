import { useState } from 'react';
import { Search, Bell, ChevronDown, User, Settings, LogOut, CheckCircle2, Clock, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  title: string;
  userName?: string;
  userRole?: string;
  avatar?: string;
  hideSearch?: boolean;
}

export default function Header({ title, userName = "Ngô Mỹ Lan", userRole = "Quản trị viên", avatar, hideSearch = false }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const notifications = [
    { id: 1, title: 'Giao dịch mới', desc: 'Người dùng Nguyễn Văn An vừa thanh toán 254.000đ', time: '2 phút trước', type: 'success' },
    { id: 2, title: 'Yêu cầu đối soát', desc: 'PT Trần Bình yêu cầu đối soát tháng 3', time: '1 giờ trước', type: 'pending' },
  ];

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-white/50 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100">
      <h1 className="text-2xl font-black text-gray-900">{title}</h1>
      
      <div className="flex items-center gap-6">
        {!hideSearch && (
          <div className="relative group hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c1e06d] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c1e06d] focus:border-transparent w-64 transition-all"
            />
          </div>
        )}

        {userRole === "Người dùng" && (
          <Link to="/cart" className="relative p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
            <ShoppingCart size={22} />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">
                {items.length}
              </span>
            )}
          </Link>
        )}
        
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className={cn(
              "relative p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all",
              showNotifications && "bg-gray-100 text-gray-900"
            )}
          >
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-3 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-black text-gray-900">Thông báo</h3>
                <span className="text-[10px] font-bold text-blue-500 hover:underline cursor-pointer">Đánh dấu đã đọc</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer flex gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      n.type === 'success' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                    )}>
                      {n.type === 'success' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{n.title}</p>
                      <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{n.desc}</p>
                      <p className="text-[9px] text-gray-400 mt-1 font-medium">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-gray-50 text-center">
                <button className="text-[10px] font-bold text-gray-400 hover:text-gray-900 transition-colors">Xem tất cả thông báo</button>
              </div>
            </div>
          )}
        </div>
        
        <div className="relative">
          <div 
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className={cn(
              "flex items-center gap-3 pl-4 border-l border-gray-100 group cursor-pointer hover:bg-gray-50 p-1 rounded-xl transition-all",
              showProfile && "bg-gray-50"
            )}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 group-hover:text-[#c1e06d] transition-colors uppercase">{userName}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{userRole}</p>
            </div>
            <div className="relative">
              <img 
                src={avatar || "https://i.pravatar.cc/150?u=admin"} 
                alt="Avatar" 
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-[#c1e06d] transition-all"
              />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-100">
                <ChevronDown size={10} className={cn("text-gray-400 transition-transform", showProfile && "rotate-180")} />
              </div>
            </div>
          </div>

          {showProfile && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-3 border-b border-gray-50">
                <p className="text-xs font-bold text-gray-900">{userName}</p>
                <p className="text-[10px] text-gray-400 font-medium">admin@fitbite.com</p>
              </div>
              <div className="py-2">
                {[
                  { label: 'Hồ sơ của tôi', icon: <User size={16} />, color: 'text-gray-600' },
                  { label: 'Cài đặt tài khoản', icon: <Settings size={16} />, color: 'text-gray-600' },
                ].map((item, i) => (
                  <button key={i} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-xl transition-colors text-left">
                    <span className={item.color}>{item.icon}</span>
                    <span className="text-xs font-bold text-gray-700">{item.label}</span>
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-gray-50">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors text-left"
                >
                  <LogOut size={16} />
                  <span className="text-xs font-bold">Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
