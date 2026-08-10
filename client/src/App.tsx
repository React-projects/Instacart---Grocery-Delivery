import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductsPage from './pages/ProductsPage';
import SearchResult from './pages/SearchResult';
import FlashDeals from './pages/FlashDeals';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import OrderTracking from './pages/OrderTracking';
import Address from './pages/Address';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminDeliveryPartners from './pages/admin/AdminDeliveryPartners';
import DeliveryLogin from './pages/delivery/DeliveryLogin';
import DeliveryLayout from './pages/delivery/DeliveryLayout';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
const App = () => {
   return (
      <>
         <Toaster position='top-right' toastOptions={{ duration: 3000, style: { fontSize: '14px', backgroundColor: '#183022', color: '#fff', borderRadius: '12px' } }} />
         <Routes>
            {/* Authenticated routes  */}
            <Route path='/login' element={<Login />} />
            {/* Main routes for pages */}
            <Route path='/' element={<MainLayout />}>
               <Route index element={<Home />} />
               <Route path='/products' element={<Products />} />
               <Route path='/product/:id' element={<ProductsPage />} />
               <Route path='/search' element={<SearchResult />} />
               <Route path='/deals' element={<FlashDeals />} />
               <Route element={<ProtectedRoute />}>
                  <Route path='/checkout' element={<Checkout />} />
                  <Route path='/orders' element={<MyOrders />} />
                  <Route path='/orders/:id' element={<OrderTracking />} />
                  <Route path='/addresses' element={<Address />} />S
               </Route>
            </Route>
            {/* Admin Pages */}
            <Route path='/admin' element={<AdminLayout />}>
               <Route index element={<AdminDashboard />} />
               <Route path='products' element={<AdminProducts />} />
               <Route path='products/new' element={<AdminProductForm />} />
               <Route path='products/:id/edit' element={<AdminProductForm />} />
               <Route path='orders' element={<AdminOrders />} />
               <Route path='delivery-partners' element={<AdminDeliveryPartners />} />
            </Route>
            {/* Delivery Pages */}
            <Route path='/delivery/login' element={<DeliveryLogin />} />
            <Route path='/delivery' element={<DeliveryLayout />}>
               <Route index element={<DeliveryDashboard />} />
            </Route>
         </Routes>
      </>
   );
};

export default App;
