import { useState, useMemo, FormEvent } from 'react';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const initialPTList = [
  { id: 1, name: 'Người dùng Admin', expertise: 'Yoga', status: 'Đang chờ', decision: 'Phê duyệt (Active)' },
  { id: 2, name: 'Nguyễn Văn A', expertise: 'Gym', status: 'Đã khóa', decision: ['Khóa', 'Mở khóa'] },
  { id: 3, name: 'Trần Thị B', expertise: 'Gym', status: 'Đang hoạt động', decision: 'Từ chối' },
];

export default function AdminPT() {
  const [pts, setPts] = useState(initialPTList);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPT, setEditingPT] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', expertise: '', status: 'Pending' });

  const filteredPTs = useMemo(() => {
    return pts.filter(pt => 
      pt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pt.expertise.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [pts, searchQuery]);

  const handleOpenAdd = () => {
    setEditingPT(null);
    setFormData({ name: '', expertise: '', status: 'Pending' });
    setShowModal(true);
  };

  const handleOpenEdit = (pt: any) => {
    setEditingPT(pt);
    setFormData({ name: pt.name, expertise: pt.expertise, status: pt.status });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      setPts(pts.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingPT) {
      setPts(pts.map(p => p.id === editingPT.id ? { ...p, ...formData } : p));
    } else {
      const newPT = {
        id: Date.now(),
        ...formData,
        decision: 'Approve (Active)'
      };
      setPts([...pts, newPT]);
    }
    setShowModal(false);
  };

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col">
        <Header title="Quản lý và phê duyệt PT" userName="NGÔ MỸ LAN" userRole="Quản trị viên" hideSearch={true} />
        
        <main className="p-8 space-y-8 overflow-y-auto">
          {/* Search and Add Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative group flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm theo tên." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 bg-gray-100 border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 transition-all font-bold"
              />
            </div>
            <button 
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-[#ff5722] text-white px-8 py-3.5 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-orange-500/20"
            >
              <Plus size={18} />
              Thêm người dùng mới
            </button>
          </div>

          {/* PT Table */}
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th className="p-8">Tên</th>
                  <th className="p-8">Chuyên môn</th>
                  <th className="p-8">Trạng thái</th>
                  <th className="p-8">Quyền quyết định</th>
                  <th className="p-8">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPTs.map((pt) => (
                  <tr key={pt.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="p-8 text-sm font-bold text-gray-900">{pt.name}</td>
                    <td className="p-8 text-sm font-bold text-gray-500">{pt.expertise}</td>
                    <td className="p-8">
                      <span className={cn(
                        "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider",
                        pt.status === 'Đang chờ' && "bg-orange-50 text-orange-500",
                        pt.status === 'Đã khóa' && "bg-red-50 text-red-500",
                        pt.status === 'Đang hoạt động' && "bg-green-50 text-green-500"
                      )}>
                        {pt.status}
                      </span>
                    </td>
                    <td className="p-8">
                      <div className="flex gap-2">
                        {Array.isArray(pt.decision) ? (
                          pt.decision.map((dec) => (
                            <button key={dec} className={cn(
                              "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                              dec === 'Khóa' ? "bg-red-100 text-red-500 hover:bg-red-200" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                            )}>
                              {dec}
                            </button>
                          ))
                        ) : (
                          <button className={cn(
                            "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                            pt.decision === 'Phê duyệt (Active)' ? "bg-green-100 text-green-500 hover:bg-green-200" : "bg-red-100 text-red-500 hover:bg-red-200"
                          )}>
                            {pt.decision}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleOpenEdit(pt)}
                          className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(pt.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredPTs.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 font-bold">Không tìm thấy người dùng phù hợp...</p>
            </div>
          )}
        </main>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-[40px] shadow-2xl max-w-md w-full p-8 space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-gray-900">{editingPT ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Họ và tên</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên..." 
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Chuyên môn</label>
                <input 
                  type="text" 
                  required
                  value={formData.expertise}
                  onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                  placeholder="VD: Yoga, Gym..." 
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Trạng thái</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold appearance-none"
                >
                  <option value="Đang chờ">Đang chờ</option>
                  <option value="Đang hoạt động">Đang hoạt động</option>
                  <option value="Đã khóa">Đã khóa</option>
                </select>
              </div>

              <Button type="submit" className="w-full py-8 bg-blue-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all">
                {editingPT ? 'Lưu chỉnh sửa' : 'Thêm mới'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
