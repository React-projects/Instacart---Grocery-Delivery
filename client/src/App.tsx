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
const App = () => {
    return (
        <>
            <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontSize: '14px', backgroundColor: '#183022', color: '#fff', borderRadius: '12px' } }} />
            <Routes>
                {/* Authenticated routes  */}
                <Route path="/login" element={<Login />} />
                {/* Main routes for pages */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductsPage />} />
                    <Route path="/search" element={<SearchResult />} />
                    <Route path="/deals" element={<FlashDeals />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<MyOrders />} />
                    <Route path="/order/:id" element={<OrderTracking />} />
                    <Route path="/addresses" element={<Address />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;
