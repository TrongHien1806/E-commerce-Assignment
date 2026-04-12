import { useState, useMemo } from 'react';
import { Search, Star, Award, TrendingUp, ChevronRight, Filter, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { cn } from '@/lib/utils';

const ptList = [
  { 
    id: 1, 
    name: 'Nguyễn Văn A', 
    experience: '5 năm', 
    specialization: 'Giảm cân, Đốt mỡ', 
    rating: 4.9, 
    reviews: 128,
    image: 'https://picsum.photos/seed/pt1/400/400',
    price: 1500000,
    tags: ['Chuyên gia dinh dưỡng', 'Tận tâm']
  },
  { 
    id: 2, 
    name: 'Trần Thị B', 
    experience: '3 năm', 
    specialization: 'Tăng cơ, Yoga', 
    rating: 4.8, 
    reviews: 95,
    image: 'https://picsum.photos/seed/pt2/400/400',
    price: 1200000,
    tags: ['Yoga Master', 'Phục hồi']
  },
  { 
    id: 3, 
    name: 'Lê Hoàng C', 
    experience: '8 năm', 
    specialization: 'Bodybuilding, Thi đấu', 
    rating: 5.0, 
    reviews: 210,
    image: 'https://picsum.photos/seed/pt3/400/400',
    price: 2500000,
    tags: ['Vận động viên', 'Kỷ luật']
  },
  { 
    id: 4, 
    name: 'Phạm Minh D', 
    experience: '4 năm', 
    specialization: 'Calisthenics, Sức bền', 
    rating: 4.7, 
    reviews: 82,
    image: 'https://picsum.photos/seed/pt4/400/400',
    price: 1800000,
    tags: ['Street Workout']
  },
];

const filterOptions = [
  { label: 'Chuyên môn', options: ['Tất cả', 'Giảm cân', 'Tăng cơ', 'Yoga', 'Bodybuilding', 'Calisthenics'] },
  { label: 'Kinh nghiệm', options: ['Tất cả', 'Dưới 3 năm', '3-5 năm', 'Trên 5 năm'] },
];

export default function UserPT() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    specialization: 'Tất cả',
    experience: 'Tất cả'
  });

  const filteredPTs = useMemo(() => {
    return ptList.filter(pt => {
      const matchesSearch = pt.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           pt.specialization.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSpec = selectedFilters.specialization === 'Tất cả' || 
                         pt.specialization.includes(selectedFilters.specialization);
      
      let matchesExp = true;
      if (selectedFilters.experience === 'Dưới 3 năm') {
        matchesExp = parseInt(pt.experience) < 3;
      } else if (selectedFilters.experience === '3-5 năm') {
        matchesExp = parseInt(pt.experience) >= 3 && parseInt(pt.experience) <= 5;
      } else if (selectedFilters.experience === 'Trên 5 năm') {
        matchesExp = parseInt(pt.experience) > 5;
      }

      return matchesSearch && matchesSpec && matchesExp;
    });
  }, [searchQuery, selectedFilters]);

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar role="user" />
      <div className="flex-1 flex flex-col">
        <Header title="Huấn luyện viên của tôi" userName="Nam" userRole="Người dùng" avatar="https://i.pravatar.cc/150?u=nam" hideSearch={true} />
        
        <main className="p-8 space-y-8 overflow-y-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Huấn luyện viên chuyên nghiệp</h1>
              <p className="text-gray-500">Tìm kiếm người đồng hành hoàn hảo cho mục tiêu của bạn</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Input 
                  placeholder="Tìm tên PT, chuyên môn..." 
                  icon={<Search size={18} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className={cn("rounded-xl shrink-0 transition-all", showFilter && "bg-orange-50 border-orange-200 text-orange-500")}
                onClick={() => setShowFilter(!showFilter)}
              >
                <Filter size={20} />
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showFilter && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filterOptions.map((group) => (
                    <div key={group.label} className="space-y-4">
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{group.label}</h3>
                      <div className="flex flex-wrap gap-2">
                        {group.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setSelectedFilters({
                              ...selectedFilters,
                              [group.label === 'Chuyên môn' ? 'specialization' : 'experience']: opt
                            })}
                            className={cn(
                              "px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                              (group.label === 'Chuyên môn' ? selectedFilters.specialization : selectedFilters.experience) === opt
                                ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            )}
                          >
                            {opt}
                            {(group.label === 'Chuyên môn' ? selectedFilters.specialization : selectedFilters.experience) === opt && <Check size={14} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredPTs.map((pt) => (
              <Link key={pt.id} to={`/pt/${pt.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row gap-6 group cursor-pointer h-full"
                >
                  <div className="relative w-full sm:w-48 h-48 rounded-2xl overflow-hidden shrink-0">
                    <img 
                      src={pt.image} 
                      alt={pt.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-[10px] font-bold text-gray-900">{pt.rating} ({pt.reviews})</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {pt.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{pt.name}</h3>
                      <div className="grid grid-cols-2 gap-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Award size={16} className="text-orange-500" />
                          <span>{pt.experience} kinh nghiệm</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <TrendingUp size={16} className="text-green-500" />
                          <span>{pt.specialization}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div>
                        <p className="text-xs text-gray-400">Giá từ</p>
                        <p className="text-lg font-black text-orange-500">
                          {pt.price.toLocaleString('vi-VN')}đ<span className="text-xs font-medium text-gray-400">/tháng</span>
                        </p>
                      </div>
                      <Button className="rounded-xl group-hover:bg-orange-600">
                        Xem hồ sơ <ChevronRight size={16} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
          {filteredPTs.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 font-bold">Không tìm thấy huấn luyện viên phù hợp...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
