import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  MoreVertical, 
  Clock, 
  MapPin,
  CheckCircle2,
  AlertCircle,
  Users,
  X,
  Calendar as CalendarIcon
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { cn } from '@/lib/utils';

const schedule = [
  { id: 1, student: 'Nguyễn Văn B', time: '09:00 - 10:20', day: 'CN', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { id: 2, student: 'Nguyễn Văn A', time: '10:30 - 11:50', day: 'T3', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  { id: 3, student: 'Nguyễn Văn C', time: '12:30 - 13:50', day: 'T4', color: 'bg-cyan-50 text-cyan-600 border-cyan-100' },
  { id: 4, student: 'Lớp Yoga Sáng', time: '05:00 - 06:30', day: 'T2', color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { id: 5, student: 'Gym Tối', time: '20:00 - 21:30', day: 'T5', color: 'bg-purple-50 text-purple-600 border-purple-100' },
];

const students = [
  { name: 'Nguyễn Văn A', gender: 'Nam', date: '25/01/2026', startTime: '10:00', endTime: '11:30', location: 'Studio A', status: 'Completed' },
  { name: 'Trần Thị B', gender: 'Nữ', date: '05/02/2026', startTime: '14:00', endTime: '15:30', location: 'Cơ sở B', status: 'Completed' },
  { name: 'Lê Văn C', gender: 'Nam', date: '10/03/2026', startTime: '13:00', endTime: '14:30', location: 'Phòng tập 1', status: 'Upcoming' },
  { name: 'Phạm Minh D', gender: 'Nam', date: '02/04/2026', startTime: '09:45', endTime: '11:15', location: 'Sảnh B', status: 'Upcoming' },
];

const months = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const dates = [14, 15, 16, 17, 18, 19, 20];
const HOUR_HEIGHT = 64;

export default function PTDashboard() {
  const [currentMonth, setCurrentMonth] = useState(3); // April
  const [showMonthSelect, setShowMonthSelect] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAllStudents, setShowAllStudents] = useState(false);

  const parseTime = (timeStr: string) => {
    const [start, end] = timeStr.split(' - ');
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    return { sH, sM, eH, eM };
  };

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar role="pt" />
      
      <div className="flex-1 flex flex-col">
        <Header title="Quản lý ca học" userRole="Huấn luyện viên" avatar="https://i.pravatar.cc/150?u=pt" hideSearch={true} />
        
        <main className="p-8 space-y-10 overflow-y-auto">
          {/* Calendar View */}
          <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">Lịch dạy của tôi</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button 
                    onClick={() => setShowMonthSelect(!showMonthSelect)}
                    className="flex items-center bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl px-4 py-2 gap-4"
                  >
                    <span className="text-sm font-bold text-gray-900">{months[currentMonth]}</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                  
                  {showMonthSelect && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-30 grid grid-cols-1 max-h-64 overflow-y-auto">
                      {months.map((month, idx) => (
                        <button
                          key={month}
                          onClick={() => {
                            setCurrentMonth(idx);
                            setShowMonthSelect(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-colors",
                            currentMonth === idx ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-200"
                >
                  <Plus size={18} />
                  Thêm ca dạy
                </button>
              </div>
            </div>

            <div className="space-y-0 border border-gray-100 rounded-3xl overflow-hidden">
              {/* Days Header */}
              <div className="grid grid-cols-[80px_1fr] bg-gray-50 border-b border-gray-100">
                <div className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-center border-r border-gray-100">Thời gian</div>
                <div className="grid grid-cols-7">
                  {days.map((day, i) => (
                    <div key={day} className={cn(
                      "text-center py-4 space-y-1 border-r border-gray-100 last:border-r-0",
                      day === 'T3' ? "bg-blue-50/50" : ""
                    )}>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{dates[i]}</p>
                      <p className={cn(
                        "text-xs font-black",
                        day === 'T3' ? "text-blue-600" : "text-gray-900"
                      )}>{day}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Slots Scrollable Area */}
              <div className="max-h-[600px] overflow-y-auto relative">
                <div className="grid grid-cols-[80px_1fr]">
                  {/* Time Column */}
                  <div className="bg-gray-50/30 border-r border-gray-100">
                    {Array.from({ length: 24 }).map((_, hour) => (
                      <div key={hour} style={{ height: HOUR_HEIGHT }} className="flex items-start justify-center pt-2 border-b border-gray-50 last:border-b-0">
                        <span className="text-[10px] font-bold text-gray-300">{hour.toString().padStart(2, '0')}:00</span>
                      </div>
                    ))}
                  </div>

                  {/* Grid and Sessions */}
                  <div className="relative">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 grid grid-cols-7 pointer-events-none">
                      {days.map((day) => (
                        <div key={day} className="border-r border-gray-50 last:border-r-0" />
                      ))}
                    </div>
                    {Array.from({ length: 24 }).map((_, hour) => (
                      <div key={hour} style={{ height: HOUR_HEIGHT }} className="border-b border-gray-50 last:border-b-0" />
                    ))}

                    {/* Booked Sessions */}
                    <div className="absolute inset-0 grid grid-cols-7 pointer-events-none">
                      {schedule.map((session) => {
                        const { sH, sM, eH, eM } = parseTime(session.time);
                        const top = (sH * HOUR_HEIGHT) + (sM / 60 * HOUR_HEIGHT);
                        const duration = (eH * 60 + eM) - (sH * 60 + sM);
                        const height = (duration / 60) * HOUR_HEIGHT;
                        const dayIndex = days.indexOf(session.day);

                        return (
                          <div 
                            key={session.id}
                            className="absolute pointer-events-auto px-1"
                            style={{
                              top: `${top}px`,
                              height: `${height}px`,
                              left: `${(dayIndex / 7) * 100}%`,
                              width: `${100 / 7}%`,
                            }}
                          >
                            <div className={cn(
                              "h-full w-full p-2 rounded-xl border shadow-sm flex flex-col justify-between overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer",
                              session.color
                            )}>
                              <div>
                                <p className="text-[10px] font-black leading-tight">{session.student}</p>
                                <div className="flex items-center gap-1 mt-0.5 opacity-70">
                                  <Clock size={8} />
                                  <span className="text-[8px] font-bold">{session.time.split(' - ')[0]}</span>
                                </div>
                              </div>
                              {height > 40 && (
                                <div className="flex items-center gap-1 opacity-60">
                                  <MapPin size={8} />
                                  <span className="text-[8px] font-medium">Studio A</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Student List */}
          <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users size={24} className="text-gray-900" />
                <h2 className="text-xl font-black text-gray-900">Danh sách học viên</h2>
              </div>
              <button 
                onClick={() => setShowAllStudents(!showAllStudents)}
                className="text-sm font-bold text-blue-500 hover:underline flex items-center gap-1"
              >
                {showAllStudents ? 'Thu gọn' : 'Xem tất cả'} <ChevronRight size={16} className={cn("transition-transform", showAllStudents && "rotate-90")} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                    <th className="pb-4 font-bold">Họ tên</th>
                    <th className="pb-4 font-bold text-center">Giới tính</th>
                    <th className="pb-4 font-bold">Ngày tập</th>
                    <th className="pb-4 font-bold">Bắt đầu</th>
                    <th className="pb-4 font-bold">Kết thúc</th>
                    <th className="pb-4 font-bold">Địa điểm</th>
                    <th className="pb-4 font-bold">Trạng thái</th>
                    <th className="pb-4 font-bold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(showAllStudents ? students : students.slice(0, 3)).map((student, i) => (
                    <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                            {student.name.split(' ').pop()?.[0]}
                          </div>
                          <span className="text-sm font-bold text-gray-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[10px] font-bold",
                          student.gender === 'Nam' ? "bg-blue-50 text-blue-500" : "bg-pink-50 text-pink-500"
                        )}>
                          {student.gender}
                        </span>
                      </td>
                      <td className="py-4 text-sm font-medium text-gray-500">{student.date}</td>
                      <td className="py-4 text-sm font-black text-gray-900">{student.startTime}</td>
                      <td className="py-4 text-sm font-black text-gray-900">{student.endTime}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                          <MapPin size={14} className="text-gray-300" />
                          {student.location}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={cn(
                          "px-3 py-1 rounded-lg text-[10px] font-bold inline-flex items-center gap-1",
                          student.status === 'Completed' 
                            ? "bg-green-50 text-green-600" 
                            : "bg-blue-50 text-blue-600"
                        )}>
                          {student.status === 'Completed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                          {student.status === 'Completed' ? 'Hoàn thành' : 'Sắp tới'}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-[40px] shadow-2xl max-w-md w-full p-8 space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-gray-900">Thêm ca dạy mới</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tên học viên / Lớp</label>
                <input type="text" placeholder="Nhập tên..." className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ngày</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="date" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Địa điểm</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Studio..." className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bắt đầu</label>
                  <input type="time" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kết thúc</label>
                  <input type="time" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold" />
                </div>
              </div>

              <button className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all">
                Lưu ca dạy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronDown({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
