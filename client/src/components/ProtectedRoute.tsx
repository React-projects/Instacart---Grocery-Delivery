import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './common/Loading';
const ProtectedRoute = () => {
   const { user, loading } = useAuth();
   if (loading) return <Loading />;
   if (!user) return <Navigate to='/login' replace />;
   if (!user) return <Outlet />;
   return <Outlet />;
};

export default ProtectedRoute;
