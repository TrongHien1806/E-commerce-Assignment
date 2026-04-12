import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Utensils, 
  Users, 
  ChevronRight, 
  Star, 
  Flame, 
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  X,
  ArrowRight,
  Play,
  ShieldCheck,
  Heart,
  Zap,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import Navbar from '@/components/layout/Navbar';
import { cn } from '@/lib/utils';

export default function Home() {
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recType, setRecType] = useState<'day' | 'week'>('day');

  return (
    <div className="min-h-screen bg-white selection:bg-orange-100 selection:text-orange-900">
      <Navbar />

      {/* Hero Section - SaaS Split Layout Style */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 text-center lg:text-left space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-black tracking-tight"
              >
                <Sparkles size={16} className="animate-pulse" />
                <span>GIẢI PHÁP DINH DƯỠNG THẾ HỆ MỚI</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-6xl md:text-8xl font-black text-gray-900 leading-[0.9] tracking-tighter text-balance"
              >
                Ăn uống <span className="text-orange-500 italic font-serif font-normal">thông minh</span>, <br />
                Sống khỏe mỗi ngày.
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
              >
                FitBite tự động hóa việc lên thực đơn dựa trên mục tiêu của bạn. Tiết kiệm thời gian, tối ưu sức khỏe và kết nối cùng chuyên gia.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto rounded-2xl px-10 h-16 text-lg font-black shadow-2xl shadow-orange-500/20 group"
                  onClick={() => setShowRecommendation(true)}
                >
                  Bắt đầu ngay
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Link to="/pt-directory" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-2xl px-10 h-16 text-lg font-black border-2 hover:bg-gray-50">
                    Khám phá PT
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center justify-center lg:justify-start gap-6 pt-4"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img 
                      key={i}
                      src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                      alt="User" 
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-orange-500">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-gray-500 font-bold">10,000+ người dùng tin tưởng</p>
                </div>
              </motion.div>
            </div>

            <div className="flex-1 relative w-full max-w-2xl lg:max-w-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10"
              >
                {/* Main App Preview Mockup */}
                <div className="bg-white rounded-[48px] shadow-[0_32px_80px_rgba(0,0,0,0.1)] border border-gray-100 p-4 relative overflow-hidden">
                  <div className="bg-gray-50 rounded-[36px] overflow-hidden aspect-[4/3] relative">
                    <img 
                      src="https://picsum.photos/seed/mealplan/1200/900" 
                      alt="Meal Plan Preview" 
                      className="w-full h-full object-cover opacity-90"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">Thực đơn hôm nay</p>
                      <h3 className="text-3xl font-black">Salad Ức Gà & Bơ</h3>
                      <div className="flex gap-4 mt-4">
                        <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">450 kcal</div>
                        <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">35g Protein</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl z-20 border border-gray-50 hidden md:block"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                      <Flame size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-black uppercase tracking-wider">Calo tiêu thụ</p>
                      <p className="text-2xl font-black text-gray-900">1,240 <span className="text-sm font-medium text-gray-400">/ 2,000</span></p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl z-20 border border-gray-50 hidden md:block"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-black uppercase tracking-wider">Tiến độ tuần</p>
                      <p className="text-2xl font-black text-gray-900">+2.4 kg <span className="text-sm font-medium text-green-500">Giảm</span></p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Decorative Circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-gray-100 rounded-full pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-gray-50 rounded-full pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Người dùng", value: "50K+" },
              { label: "Món ăn", value: "2,000+" },
              { label: "PT Chuyên nghiệp", value: "500+" },
              { label: "Đánh giá 5 sao", value: "15K+" },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <p className="text-4xl md:text-6xl font-black text-orange-500">{stat.value}</p>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
      </section>

      {/* How It Works - Visual Steps */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight">Quy trình 3 bước đơn giản</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">Chúng tôi tối ưu hóa mọi công đoạn để bạn tập trung vào việc thưởng thức.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-24 left-0 w-full h-0.5 bg-gray-100 -z-10" />
            
            {[
              { 
                step: "01", 
                title: "Nhập chỉ số", 
                desc: "Cung cấp thông tin về cân nặng, chiều cao và mục tiêu sức khỏe của bạn.",
                icon: <Target className="text-orange-500" size={32} />
              },
              { 
                step: "02", 
                title: "Nhận thực đơn", 
                desc: "Hệ thống tự động thiết kế thực đơn cá nhân hóa cho từng ngày trong tuần dựa trên chỉ số của bạn.",
                icon: <Utensils className="text-blue-500" size={32} />
              },
              { 
                step: "03", 
                title: "Kết nối PT", 
                desc: "Lựa chọn huấn luyện viên phù hợp để đồng hành và tối ưu hóa kết quả.",
                icon: <Users className="text-green-500" size={32} />
              },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="w-20 h-20 bg-white border-4 border-gray-50 rounded-[32px] shadow-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                <div className="space-y-4">
                  <span className="text-xs font-black text-gray-300 tracking-[0.3em] uppercase">{item.step}</span>
                  <h3 className="text-2xl font-black text-gray-900">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase - Bento Grid Style */}
      <section className="py-32 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white p-12 rounded-[48px] shadow-xl border border-gray-100 flex flex-col justify-between relative overflow-hidden group">
              <div className="relative z-10 max-w-md">
                <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-8">
                  <Zap size={28} />
                </div>
                <h3 className="text-4xl font-black text-gray-900 mb-6">Cá nhân hóa tuyệt đối bằng công nghệ thông minh</h3>
                <p className="text-lg text-gray-500 font-medium leading-relaxed">
                  Không còn những thực đơn chung chung. FitBite hiểu rõ cơ thể bạn cần gì để đạt được trạng thái tốt nhất thông qua thuật toán tối ưu.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500/5 -skew-x-12 translate-x-1/4 group-hover:translate-x-0 transition-transform duration-1000" />
              <div className="mt-12 relative z-10">
                <Button variant="outline" className="rounded-2xl px-8 h-14 font-black border-2">Tìm hiểu công nghệ</Button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-orange-500 p-12 rounded-[48px] shadow-xl text-white flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-3xl font-black mb-6">An toàn & Bảo mật</h3>
                <p className="text-orange-100 font-medium">Dữ liệu sức khỏe của bạn được bảo vệ nghiêm ngặt nhất.</p>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16 blur-3xl" />
            </div>

            <div className="lg:col-span-4 bg-gray-900 p-12 rounded-[48px] shadow-xl text-white flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                  <Heart size={28} className="text-red-500" />
                </div>
                <h3 className="text-3xl font-black mb-6">Cộng đồng văn minh</h3>
                <p className="text-gray-400 font-medium">Chia sẻ và truyền cảm hứng cùng những người có cùng mục tiêu.</p>
              </div>
            </div>

            <div className="lg:col-span-8 bg-white p-12 rounded-[48px] shadow-xl border border-gray-100 flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <h3 className="text-4xl font-black text-gray-900 mb-6">Đội ngũ PT tận tâm</h3>
                <p className="text-lg text-gray-500 font-medium leading-relaxed mb-8">
                  Kết nối trực tiếp với các huấn luyện viên để nhận được sự tư vấn chuyên sâu nhất.
                </p>
                <Link to="/pt-directory">
                  <Button className="rounded-2xl px-8 h-14 font-black">Xem danh sách PT</Button>
                </Link>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square rounded-3xl overflow-hidden shadow-lg">
                    <img 
                      src={`https://picsum.photos/seed/pt${i}/300/300`} 
                      alt="PT" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-20">
            <div className="max-w-2xl space-y-4 text-center lg:text-left">
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight">Câu chuyện thành công</h2>
              <p className="text-xl text-gray-500 font-medium">Họ đã thay đổi, còn bạn thì sao?</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" size="icon" className="w-14 h-14 rounded-2xl border-2"><ChevronRight size={24} className="rotate-180" /></Button>
              <Button variant="outline" size="icon" className="w-14 h-14 rounded-2xl border-2"><ChevronRight size={24} /></Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Nguyễn Văn A", role: "Nhân viên văn phòng", text: "FitBite đã giúp tôi giảm 5kg trong vòng 2 tháng mà không cảm thấy mệt mỏi nhờ thực đơn rất đa dạng.", img: "https://i.pravatar.cc/150?img=11" },
              { name: "Trần Thị B", role: "Kinh doanh tự do", text: "Việc kết nối với PT qua app rất tiện lợi. Tôi có thể tập luyện và ăn uống theo đúng lộ trình chuyên gia đề ra.", img: "https://i.pravatar.cc/150?img=32" },
              { name: "Lê Văn C", role: "Lập trình viên", text: "Hệ thống gợi ý món ăn rất thông minh, phù hợp với người bận rộn như tôi. Giao diện cực kỳ dễ sử dụng.", img: "https://i.pravatar.cc/150?img=53" },
            ].map((t, i) => (
              <div key={i} className="bg-gray-50 p-10 rounded-[40px] space-y-8 border border-transparent hover:border-orange-200 transition-colors">
                <div className="flex gap-1 text-orange-500">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <p className="text-lg text-gray-700 font-medium italic leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4 pt-4">
                  <img src={t.img} alt={t.name} className="w-14 h-14 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-black text-gray-900">{t.name}</h4>
                    <p className="text-sm text-gray-500 font-bold">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto bg-orange-500 rounded-[64px] p-12 md:p-24 text-center text-white relative overflow-hidden">
          <div className="relative z-10 space-y-10">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none">Sẵn sàng để thay đổi?</h2>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto font-medium">Đăng ký ngay hôm nay để nhận được lộ trình dinh dưỡng miễn phí cho tuần đầu tiên.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-white text-orange-500 hover:bg-orange-50 rounded-2xl px-12 h-16 text-xl font-black shadow-2xl">Đăng ký miễn phí</Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10 rounded-2xl px-12 h-16 text-xl font-black">Đăng nhập</Button>
              </Link>
            </div>
          </div>
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-black rounded-full blur-[120px]" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-32 pb-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="space-y-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                  <Utensils size={20} />
                </div>
                <span className="text-2xl font-black tracking-tighter">FitBite</span>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed">Nâng tầm sức khỏe người Việt thông qua dinh dưỡng và công nghệ.</p>
              <div className="flex gap-4">
                {['fb', 'ig', 'tw', 'yt'].map((s) => (
                  <div key={s} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all cursor-pointer">
                    <span className="text-xs font-black uppercase">{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-black text-gray-900 mb-8 uppercase tracking-widest text-xs">Sản phẩm</h4>
              <ul className="space-y-4 text-gray-500 font-medium">
                <li><Link to="/food-catalog" className="hover:text-orange-500 transition-colors">Thực đơn</Link></li>
                <li><Link to="/pt-directory" className="hover:text-orange-500 transition-colors">Tìm kiếm PT</Link></li>
                <li><Link to="/health-survey" className="hover:text-orange-500 transition-colors">Gợi ý thực đơn</Link></li>
                <li><Link to="/dashboard" className="hover:text-orange-500 transition-colors">Theo dõi tiến độ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-gray-900 mb-8 uppercase tracking-widest text-xs">Công ty</h4>
              <ul className="space-y-4 text-gray-500 font-medium">
                <li><a href="#" className="hover:text-orange-500 transition-colors">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Tuyển dụng</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Blog sức khỏe</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Liên hệ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-gray-900 mb-8 uppercase tracking-widest text-xs">Hỗ trợ</h4>
              <ul className="space-y-4 text-gray-500 font-medium">
                <li><a href="#" className="hover:text-orange-500 transition-colors">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Điều khoản dịch vụ</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Chính sách bảo mật</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-sm font-medium">© 2026 FitBite. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="text-gray-400 hover:text-gray-900 text-sm font-medium transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-gray-900 text-sm font-medium transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-gray-900 text-sm font-medium transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Recommendation Modal */}
      <AnimatePresence>
        {showRecommendation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRecommendation(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[48px] shadow-2xl max-w-lg w-full p-8 md:p-12 overflow-hidden"
            >
              <button 
                onClick={() => setShowRecommendation(false)}
                className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={28} />
              </button>

              <div className="space-y-10">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles size={40} />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900">Gợi ý thực đơn cho bạn</h3>
                  <p className="text-gray-500 font-medium">Hệ thống sẽ dựa trên mục tiêu giảm cân của bạn để lên thực đơn phù hợp.</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={() => setRecType('day')}
                    className={cn(
                      "p-8 rounded-[32px] border-4 transition-all flex flex-col items-center gap-4",
                      recType === 'day' ? "border-orange-500 bg-orange-50" : "border-gray-50 hover:border-orange-200"
                    )}
                  >
                    <Calendar size={32} className={recType === 'day' ? "text-orange-500" : "text-gray-400"} />
                    <span className="font-black">Cho 1 ngày</span>
                  </button>
                  <button
                    onClick={() => setRecType('week')}
                    className={cn(
                      "p-8 rounded-[32px] border-4 transition-all flex flex-col items-center gap-4",
                      recType === 'week' ? "border-orange-500 bg-orange-50" : "border-gray-50 hover:border-orange-200"
                    )}
                  >
                    <Clock size={32} className={recType === 'week' ? "text-orange-500" : "text-gray-400"} />
                    <span className="font-black">Cho 1 tuần</span>
                  </button>
                </div>

                <Link to="/health-survey" className="w-full">
                  <Button 
                    className="w-full h-16 rounded-2xl text-xl font-black shadow-2xl shadow-orange-500/20"
                    onClick={() => setShowRecommendation(false)}
                  >
                    Bắt đầu gợi ý
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
