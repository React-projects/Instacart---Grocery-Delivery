import { Outlet } from 'react-router-dom';
import Banner from '../components/Header/Banner';
import Navbar from '../components/Header/Navbar';
import MainFooter from '../components/Footer/MainFooter';
import CartSidebar from '../components/common/CartSidebar';

const MainLayout = () => {
    return (
        <>
            <Banner />
            <Navbar />
            <main className="min-h-screen">
                <Outlet />
            </main>
            <MainFooter />
            <CartSidebar />
        </>
    );
};

export default MainLayout;
