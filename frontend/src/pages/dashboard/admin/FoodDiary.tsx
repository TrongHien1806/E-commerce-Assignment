import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';

export default function AdminFoodDiary() {
  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col">
        <Header title="Nhật ký thực phẩm (Admin)" userName="Admin" userRole="Quản trị viên" avatar="https://i.pravatar.cc/150?u=admin" />
        <main className="p-8">
          <div className="bg-white p-12 rounded-[40px] shadow-sm border border-gray-50 text-center">
            <h2 className="text-2xl font-black text-gray-900 mb-4">Quản lý nhật ký thực phẩm hệ thống</h2>
            <p className="text-gray-400 font-bold">Tính năng đang được cập nhật...</p>
          </div>
        </main>
      </div>
    </div>
  );
}
