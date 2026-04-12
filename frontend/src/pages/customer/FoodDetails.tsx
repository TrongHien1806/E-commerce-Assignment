import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Flame, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  Minus,
  ShoppingCart,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Navbar from '@/components/layout/Navbar';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

const foodItem = {
  id: 1,
  name: 'Ức gà áp chảo sốt cam',
  price: 85000,
  calories: 450,
  image: 'https://picsum.photos/seed/chicken/800/600',
  description: 'Món ăn giàu protein với ức gà tươi ngon được áp chảo vàng đều, kết hợp cùng sốt cam chua ngọt thanh mát. Phù hợp cho chế độ ăn tăng cơ và giảm mỡ.',
  nutrition: {
    'Đạm (Protein)': '42g',
    'Tinh bột (Carbs)': '12g',
    'Béo (Fat)': '8g',
    'Xơ (Fiber)': '4g'
  },
  ingredients: ['Ức gà 200g', 'Cam sành', 'Mật ong', 'Dầu olive', 'Gia vị thảo mộc'],
  allergies: ['Không có'],
  prepTime: '20-30 phút'
};

export default function FoodDetails() {
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: foodItem.id,
      name: foodItem.name,
      price: foodItem.price,
      image: foodItem.image,
      calories: foodItem.calories,
      type: 'food'
    }, qty);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/food-catalog" className="inline-flex items-center text-gray-500 hover:text-orange-500 mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Quay lại thực đơn
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl border-8 border-gray-50">
              <img 
                src={foodItem.image} 
                alt={foodItem.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                  <img src={`https://picsum.photos/seed/food${i}/200/200`} alt="Gallery" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-bold rounded-full uppercase tracking-wider">Bán chạy nhất</span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <CheckCircle2 size={16} />
                  <span className="text-xs font-bold">Đã kiểm định dinh dưỡng</span>
                </div>
              </div>
              <h1 className="text-4xl font-black text-gray-900 leading-tight">{foodItem.name}</h1>
              <div className="flex items-center gap-6">
                <p className="text-3xl font-black text-orange-500">{foodItem.price.toLocaleString('vi-VN')}đ</p>
                <div className="h-8 w-px bg-gray-100" />
                <div className="flex items-center gap-2 text-gray-500">
                  <Flame size={20} className="text-orange-500" />
                  <span className="font-bold">{foodItem.calories} kcal</span>
                </div>
              </div>
            </div>

            <p className="text-gray-500 leading-relaxed text-lg italic">"{foodItem.description}"</p>

            {/* Nutrition Facts */}
            <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 grid grid-cols-4 gap-4">
              {Object.entries(foodItem.nutrition).map(([key, value]) => (
                <div key={key} className="text-center space-y-1">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{key}</p>
                  <p className="text-lg font-black text-gray-900">{value}</p>
                </div>
              ))}
            </div>

            {/* Ingredients & Allergies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-green-500" /> Thành phần chính
                </h3>
                <ul className="space-y-2">
                  {foodItem.ingredients.map(ing => (
                    <li key={ing} className="text-sm text-gray-500 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" /> {ing}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-orange-500" /> Cảnh báo dị ứng
                </h3>
                <div className="p-3 bg-orange-50 rounded-2xl border border-orange-100">
                  <p className="text-xs text-orange-700 font-medium">{foodItem.allergies.join(', ')}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-4 bg-gray-100 p-2 rounded-2xl w-full sm:w-auto justify-between sm:justify-start">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-500 hover:text-orange-500 transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="w-12 text-center font-black text-lg">{qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-500 hover:text-orange-500 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <Button 
                size="lg" 
                className="w-full sm:flex-1 h-14 rounded-2xl text-lg shadow-xl shadow-orange-200"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={20} className="mr-2" /> Thêm vào giỏ hàng
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
