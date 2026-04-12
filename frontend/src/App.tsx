import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { CartProvider } from './context/CartContext';

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const Home = lazy(() => import('./pages/customer/Home'));
const HealthSurvey = lazy(() => import('./pages/customer/HealthSurvey'));
const Dashboard = lazy(() => import('./pages/customer/Dashboard'));
const UserDashboard = lazy(() => import('./pages/dashboard/UserDashboard'));
const UserMenu = lazy(() => import('./pages/dashboard/user/UserMenu'));
const UserDiary = lazy(() => import('./pages/dashboard/user/UserDiary'));
const UserPT = lazy(() => import('./pages/dashboard/user/UserPT'));
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'));
const AdminMenu = lazy(() => import('./pages/dashboard/admin/AdminMenu'));
const AdminFoodDiary = lazy(() => import('./pages/dashboard/admin/FoodDiary'));
const AdminPT = lazy(() => import('./pages/dashboard/admin/AdminPT'));
const PTDashboard = lazy(() => import('./pages/dashboard/PTDashboard'));
const PTMenu = lazy(() => import('./pages/dashboard/pt/PTMenu'));
const PTProfile = lazy(() => import('./pages/dashboard/pt/PTProfile'));
const FoodCatalog = lazy(() => import('./pages/customer/FoodCatalog'));
const FoodDetails = lazy(() => import('./pages/customer/FoodDetails'));
const PTDirectory = lazy(() => import('./pages/customer/PTDirectory'));
const PTDetails = lazy(() => import('./pages/customer/PTDetails'));
const Cart = lazy(() => import('./pages/customer/Cart'));
const Checkout = lazy(() => import('./pages/customer/Checkout'));

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
  </div>
);

const AdminAnalytics = lazy(() => import('./pages/dashboard/admin/AdminAnalytics'));
const AdminOrders = lazy(() => import('./pages/dashboard/admin/AdminOrders'));
const AdminFinanceRevenue = lazy(() => import('./pages/dashboard/admin/finance/Revenue'));
const AdminFinanceExpenses = lazy(() => import('./pages/dashboard/admin/finance/Expenses'));
const AdminFinancePayouts = lazy(() => import('./pages/dashboard/admin/finance/Payouts'));
const AdminFinanceTransactions = lazy(() => import('./pages/dashboard/admin/finance/Transactions'));

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/health-survey" element={<HealthSurvey />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/user" element={<UserDashboard />} />
            <Route path="/dashboard/menu" element={<UserMenu />} />
            <Route path="/dashboard/diary" element={<UserDiary />} />
            <Route path="/dashboard/pt" element={<UserPT />} />
            
            {/* Admin Routes */}
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/dashboard/admin/menu" element={<AdminMenu />} />
            <Route path="/dashboard/admin/pt" element={<AdminPT />} />
            <Route path="/dashboard/admin/orders" element={<AdminOrders />} />
            <Route path="/dashboard/admin/finance/revenue" element={<AdminFinanceRevenue />} />
            <Route path="/dashboard/admin/finance/expenses" element={<AdminFinanceExpenses />} />
            <Route path="/dashboard/admin/finance/payouts" element={<AdminFinancePayouts />} />
            <Route path="/dashboard/admin/finance/transactions" element={<AdminFinanceTransactions />} />
            <Route path="/dashboard/admin/food-diary" element={<AdminFoodDiary />} />

            <Route path="/dashboard/pt-view" element={<PTDashboard />} />
            <Route path="/dashboard/pt/menu" element={<PTMenu />} />
            <Route path="/dashboard/pt/profile" element={<PTProfile />} />
            <Route path="/food-catalog" element={<FoodCatalog />} />
            <Route path="/food/:id" element={<FoodDetails />} />
            <Route path="/pt-directory" element={<PTDirectory />} />
            <Route path="/pt/:id" element={<PTDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </CartProvider>
  );
}
