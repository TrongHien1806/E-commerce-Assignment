import { useState, useMemo } from 'react';
import { Search, Star, Award, MapPin, TrendingUp, ChevronRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';

const ptData = [
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

export default function PTDirectory() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPTs = useMemo(() => {
    return ptData.filter(pt => 
      pt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pt.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
            <Button variant="outline" size="icon" className="rounded-xl shrink-0">
              <Filter size={20} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
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
  );
}
