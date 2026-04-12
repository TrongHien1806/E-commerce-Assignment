import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Star, 
  Award, 
  TrendingUp, 
  MessageCircle, 
  Users,
  Instagram,
  Facebook
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Navbar from '@/components/layout/Navbar';

const ptProfile = {
  id: 101,
  name: 'Nguyễn Văn A',
  experience: '5 năm',
  specialization: 'Giảm cân, Đốt mỡ, Tăng cơ',
  rating: 4.9,
  reviews: 128,
  image: 'https://picsum.photos/seed/pt1/600/800',
  bio: 'Tôi là một huấn luyện viên đam mê với hơn 5 năm kinh nghiệm giúp hàng trăm khách hàng thay đổi vóc dáng và lối sống. Phương pháp của tôi tập trung vào sự cân bằng giữa dinh dưỡng và tập luyện khoa học.',
  achievements: [
    'Chứng chỉ NASM Certified Personal Trainer',
    'Top 10 giải thể hình Fitness Model 2022',
    'Chuyên gia dinh dưỡng thể thao cấp cao'
  ],
  services: [
    { id: 1001, title: 'Gói Giảm Cân 1-1', price: 1500000, duration: 'Tháng' },
    { id: 1002, title: 'Gói Tăng Cơ Chuyên Sâu', price: 2000000, duration: 'Tháng' },
    { id: 1003, title: 'Kế hoạch Dinh dưỡng', price: 500000, duration: 'Lần' }
  ],
  gallery: [
    { before: 'https://picsum.photos/seed/b1/400/400', after: 'https://picsum.photos/seed/a1/400/400' },
    { before: 'https://picsum.photos/seed/b2/400/400', after: 'https://picsum.photos/seed/a2/400/400' }
  ]
};

export default function PTDetails() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/pt-directory" className="inline-flex items-center text-gray-500 hover:text-orange-500 mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Quay lại danh sách PT
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] overflow-hidden shadow-2xl border border-gray-100"
            >
              <div className="aspect-[3/4] relative">
                <img 
                  src={ptProfile.image} 
                  alt={ptProfile.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl">
                  <h1 className="text-2xl font-black text-gray-900">{ptProfile.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-gray-900">{ptProfile.rating}</span>
                    <span className="text-gray-400 text-sm">({ptProfile.reviews} đánh giá)</span>
                  </div>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex justify-center gap-4">
                  <button className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                    <Facebook size={24} />
                  </button>
                  <button className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-100 transition-colors">
                    <Instagram size={24} />
                  </button>
                  <button className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors">
                    <MessageCircle size={24} />
                  </button>
                </div>
                <Button className="w-full h-14 rounded-2xl text-lg shadow-lg shadow-orange-200">
                  Đăng ký tư vấn ngay
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-gray-900">Giới thiệu bản thân</h2>
              <p className="text-lg text-gray-500 leading-relaxed italic">"{ptProfile.bio}"</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 space-y-3">
                  <h3 className="font-bold text-orange-900 flex items-center gap-2">
                    <Award size={20} /> Kinh nghiệm & Chuyên môn
                  </h3>
                  <p className="text-sm text-orange-800">{ptProfile.experience} - {ptProfile.specialization}</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 space-y-3">
                  <h3 className="font-bold text-blue-900 flex items-center gap-2">
                    <Users size={20} /> Học viên đã hỗ trợ
                  </h3>
                  <p className="text-sm text-blue-800">Hơn 500+ khách hàng đã thay đổi thành công.</p>
                </div>
              </div>
            </div>

            {/* Before/After Gallery */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900">Kết quả học viên (Before/After)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ptProfile.gallery.map((item, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-[32px] border border-gray-100 space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative rounded-2xl overflow-hidden aspect-square">
                        <img src={item.before} alt="Before" className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase">Trước</span>
                      </div>
                      <div className="relative rounded-2xl overflow-hidden aspect-square">
                        <img src={item.after} alt="After" className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase">Sau</span>
                      </div>
                    </div>
                    <p className="text-center text-xs font-bold text-gray-400">Kết quả sau 3 tháng tập luyện</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900">Các gói dịch vụ</h2>
              <div className="space-y-4">
                {ptProfile.services.map((service, i) => (
                  <div 
                    key={i} 
                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-orange-500 transition-all cursor-default"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <TrendingUp size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{service.title}</h4>
                        <p className="text-xs text-gray-400">Hỗ trợ 24/7 qua tin nhắn</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-orange-500">{service.price.toLocaleString('vi-VN')}đ</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">/{service.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
