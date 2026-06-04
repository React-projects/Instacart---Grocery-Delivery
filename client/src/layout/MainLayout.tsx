import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <>
            <p>banner</p>
            <p>navbar</p>
            <main className='min-h-screen'>
                <Outlet />
            </main>
            <p>footer</p>
            <p> cart sidebar</p>
        </>
    );
};

export default MainLayout;
