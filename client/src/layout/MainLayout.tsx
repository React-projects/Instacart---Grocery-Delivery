import { Outlet } from 'react-router-dom';
import Banner from '../components/Header/Banner';
import Navbar from '../components/Header/Navbar';

const MainLayout = () => {
    return (
        <>
            <Banner />
            <Navbar />
            <main className="min-h-screen">
                <Outlet />
            </main>
            <p>footer</p>
            <p> cart sidebar</p>
        </>
    );
};

export default MainLayout;
