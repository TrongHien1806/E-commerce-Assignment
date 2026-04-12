import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Plus, Flame, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { useCart } from '@/context/CartContext';

const foodItems = [
  { id: 1, name: 'Ức gà áp chảo sốt cam', price: 85000, calories: 450, image: 'https://picsum.photos/seed/chicken/400/300', tags: ['Giàu Protein', 'Ít Carb', 'Tăng cơ'] },
  { id: 2, name: 'Salad cá hồi bơ', price: 120000, calories: 380, image: 'https://picsum.photos/seed/salmon/400/300', tags: ['Chất béo tốt', 'Giảm cân'] },
  { id: 3, name: 'Bò xào bông cải xanh', price: 95000, calories: 520, image: 'https://picsum.photos/seed/beef/400/300', tags: ['Giàu Protein', 'Tăng cơ'] },
  { id: 4, name: 'Cơm gạo lứt ức gà', price: 75000, calories: 420, image: 'https://picsum.photos/seed/rice/400/300', tags: ['Carb chậm', 'Giảm cân'] },
  { id: 5, name: 'Mì Ý tôm sốt pesto', price: 110000, calories: 480, image: 'https://picsum.photos/seed/pasta/400/300', tags: ['Giàu Protein', 'Tăng cơ'] },
  { id: 6, name: 'Đậu phụ sốt cà chua', price: 55000, calories: 320, image: 'https://picsum.photos/seed/tofu/400/300', tags: ['Thuần chay', 'Ăn chay'] },
];

const categories = ['Tất cả', 'Giảm cân', 'Tăng cơ', 'Ăn chay', 'Ít tinh bột'];

export default function UserMenu() {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const { addItem, items } = useCart();

  const filteredFoods = useMemo(() => {
    return foodItems.filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'Tất cả' || food.tags.includes(activeCategory);
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar role="user" />
      <div className="flex-1 flex flex-col">
        <Header title="Thực đơn sức khỏe" userName="Nam" userRole="Người dùng" avatar="https://i.pravatar.cc/150?u=nam" hideSearch={true} />
        
        <main className="p-8 space-y-8 overflow-y-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Thực đơn dinh dưỡng</h1>
              <p className="text-gray-500">Hơn 100+ món ăn được thiết kế bởi chuyên gia</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Input 
                  placeholder="Tìm món ăn..." 
                  icon={<Search size={18} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="rounded-xl shrink-0">
                <SlidersHorizontal size={20} />
              </Button>
            </div>
          </div>

          <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all",
                  activeCategory === cat 
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200" 
                    : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-100"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFoods.map((food) => (
              <Link key={food.id} to={`/food/${food.id}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group h-full"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={food.image} 
                      alt={food.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Flame size={14} className="text-orange-500" />
                      <span className="text-xs font-bold text-gray-900">{food.calories} kcal</span>
                    </div>
                  </div>
                  
                  <div className="p-5 space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {food.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-orange-500 bg-orange-50 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-bold text-gray-900 line-clamp-1">{food.name}</h3>
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-lg font-black text-orange-500">
                        {food.price.toLocaleString('vi-VN')}đ
                      </p>
                      <Button size="sm" className="rounded-xl w-10 h-10 p-0" onClick={(e) => {
                        e.preventDefault();
                        addItem({
                          id: food.id,
                          name: food.name,
                          price: food.price,
                          image: food.image,
                          calories: food.calories,
                          type: 'food'
                        });
                      }}>
                        <Plus size={20} />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
          {filteredFoods.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 font-bold">Không tìm thấy món ăn phù hợp...</p>
            </div>
          )}

          {items.length > 0 && (
            <div className="fixed bottom-8 right-8 z-40 animate-in slide-in-from-bottom-4">
              <Link to="/cart">
                <Button className="rounded-full px-8 py-6 h-auto shadow-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-lg flex items-center gap-3">
                  <ShoppingCart size={24} />
                  Thanh toán ngay ({items.length})
                </Button>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
