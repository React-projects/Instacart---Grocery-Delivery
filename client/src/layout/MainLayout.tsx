import { Outlet } from 'react-router-dom';
import Banner from '../components/Header/Banner';
import Navbar from '../components/Header/Navbar';
import MainFooter from '../components/Footer/MainFooter';

const MainLayout = () => {
    return (
        <>
            <Banner />
            <Navbar />
            <main className="min-h-screen">
                <Outlet />
            </main>
            <MainFooter />
            <p> cart sidebar</p>
        </>
    );
};

export default MainLayout;
