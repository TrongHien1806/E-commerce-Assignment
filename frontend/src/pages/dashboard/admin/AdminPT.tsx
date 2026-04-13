import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Loader2, Lock, Search, ShieldCheck, ShieldX } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import api from '@/services/api';

type UserRole = 'Customer' | 'PT' | 'Admin';
type AccountStatus = 'Active' | 'Pending' | 'Locked';

type AdminUser = {
  _id: string;
  username?: string;
  email?: string;
  phone?: string;
  role: UserRole;
  account_status: AccountStatus;
  ptProfile?: {
    specialties?: string[];
    approvedByAdmin?: boolean;
    experienceYears?: number;
    rating?: number;
  } | null;
  created_at?: string;
};

export default function AdminPT() {
  const [isLoading, setIsLoading] = useState(true);
  const [isActingUserId, setIsActingUserId] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<AdminUser[]>([]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setWarning(null);
      const res = await api.get('/users');
      const data = Array.isArray(res.data?.result) ? res.data.result : [];
      setUsers(data);
    } catch (error: any) {
      console.error('Loi tai danh sach user admin:', error);
      setWarning(error?.response?.data?.message || 'Khong the tai danh sach nguoi dung.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return users;

    return users.filter((user) => {
      const specialties = (user.ptProfile?.specialties || []).join(' ').toLowerCase();
      return (
        (user.username || '').toLowerCase().includes(query) ||
        (user.email || '').toLowerCase().includes(query) ||
        (user.phone || '').toLowerCase().includes(query) ||
        specialties.includes(query)
      );
    });
  }, [users, searchQuery]);

  const ptUsers = useMemo(() => filteredUsers.filter((user) => user.role === 'PT'), [filteredUsers]);

  const handleApprovePT = async (userId: string) => {
    try {
      setIsActingUserId(userId);
      setWarning(null);
      await api.patch(`/users/${userId}/approve-pt`);
      await fetchUsers();
    } catch (error: any) {
      setWarning(error?.response?.data?.message || 'Khong the duyet PT nay.');
    } finally {
      setIsActingUserId(null);
    }
  };

  const handleToggleLock = async (userId: string, currentStatus: AccountStatus) => {
    try {
      setIsActingUserId(userId);
      setWarning(null);

      const nextStatus: AccountStatus = currentStatus === 'Locked' ? 'Active' : 'Locked';
      await api.patch(`/users/${userId}/status`, { status: nextStatus });

      await fetchUsers();
    } catch (error: any) {
      setWarning(error?.response?.data?.message || 'Khong the cap nhat trang thai tai khoan.');
    } finally {
      setIsActingUserId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#fafafa]">
        <Sidebar role="admin" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-orange-500" size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Quản lý PT" userRole="Quản trị viên" hideSearch={true} />

        <main className="p-8 space-y-6 overflow-y-auto min-w-0">
          {warning ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {warning}
            </div>
          ) : null}

          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative group w-full md:w-[26rem]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Tìm theo tên, email, số điện thoại, chuyên môn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 h-12 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-600/10 transition-all"
              />
            </div>
            <div className="ml-auto rounded-xl bg-white border border-gray-100 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              Tong PT: {ptUsers.length}
            </div>
          </div>

          <div className="bg-white rounded-[28px] shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/40">
                  <th className="px-6 py-4">PT</th>
                  <th className="px-6 py-4">Liên hệ</th>
                  <th className="px-6 py-4">Chuyên môn</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Duyệt Admin</th>
                  <th className="px-6 py-4">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ptUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500 font-medium">
                      Khong co tai khoan PT phu hop.
                    </td>
                  </tr>
                ) : (
                  ptUsers.map((user) => {
                    const isPending = user.account_status === 'Pending';
                    const isLocked = user.account_status === 'Locked';
                    const isApproved = Boolean(user.ptProfile?.approvedByAdmin);
                    const isActing = isActingUserId === user._id;

                    return (
                      <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-900">{user.username || 'N/A'}</p>
                          <p className="text-[11px] text-gray-400">ID: {user._id.slice(-8)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700">{user.email || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{user.phone || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {(user.ptProfile?.specialties || []).join(', ') || 'Chua cap nhat'}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                              user.account_status === 'Active'
                                ? 'bg-green-100 text-green-600'
                                : user.account_status === 'Pending'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-red-100 text-red-600'
                            }`}
                          >
                            {user.account_status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                              isApproved ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {isApproved ? <ShieldCheck size={12} /> : <ShieldX size={12} />}
                            {isApproved ? 'Da duyet' : 'Chua duyet'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              disabled={!isPending || isActing}
                              onClick={() => handleApprovePT(user._id)}
                              className="inline-flex items-center gap-2 px-3 h-9 rounded-xl bg-green-600 text-white text-xs font-black disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <CheckCircle2 size={14} />
                              Duyet
                            </button>
                            <button
                              type="button"
                              disabled={isPending || isActing}
                              onClick={() => handleToggleLock(user._id, user.account_status)}
                              className="inline-flex items-center gap-2 px-3 h-9 rounded-xl border border-red-200 text-red-600 text-xs font-black disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Lock size={14} />
                              {isLocked ? 'Mo khoa' : 'Khoa'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
