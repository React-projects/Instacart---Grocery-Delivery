import { useEffect, useRef, useState } from 'react';
import { PackageIcon, NavigationIcon } from 'lucide-react';
import OtpModal from '../../components/Delivery/OtpModal';
import CancelModal from '../../components/Delivery/CancelModal';
import DeliveryOrderCard from '../../components/Delivery/DeliveryOrderCard';
import Loading from '../../components/common/Loading';
import type { Order } from '../../types';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function DeliveryDashboard() {
   const [orders, setOrders] = useState<Order[]>([]);
   const [loading, setLoading] = useState(true);
   const [tab, setTab] = useState<'active' | 'completed'>('active');
   const [tracking, setTracking] = useState(false);

   // OTP modal
   const [otpModal, setOtpModal] = useState<string | null>(null);
   const [otp, setOtp] = useState('');
   const [submitting, setSubmitting] = useState(false);

   // Cancel modal
   const [cancelModal, setCancelModal] = useState<string | null>(null);
   const [cancelReason, setCancelReason] = useState('');
   const watchIdRef = useRef<number | null>(null);

   const Api_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
   const getAuthHeader = () => ({
      headers: {
         Authorization: `Bearer ${localStorage.getItem('delivery_token')}`,
      },
   });

   const fetchOrders = async () => {
      try {
         const { data } = await axios.get(`${Api_URL}/delivery/my-deliveries?status=${tab}`, getAuthHeader());
         setOrders(data);
      } catch (error: any) {
         toast.error(error.response?.data?.message || 'Failed to fetch orders');
      } finally {
         setLoading(false);
      }
   };
   useEffect(() => {
      fetchOrders();
   }, [tab]);
   // send Live location like every 5 s
   useEffect(() => {
      const activeOrders = orders.filter((order) => ['Assigned', 'Packed', 'Out For Delivery'].includes(order.status));
      if (activeOrders.length === 0 || !tracking) {
         if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
         }
         return;
      }
      const sendLocation = (pos: GeolocationPosition) => {
         const { latitude: lat, longitude: lng } = pos.coords;
         activeOrders.forEach(async (order) => {
            try {
               await axios.put(`${Api_URL}/delivery/my-deliveries/${order.id}/location`, { lat, lng }, getAuthHeader());
            } catch (error: any) {
               toast.error(error.response?.data?.message || 'Failed to send location');
            }
         });
      };
      watchIdRef.current = navigator.geolocation.watchPosition(sendLocation, () => {}, { enableHighAccuracy: true, maximumAge: 10000 });
      //    also send on interval for some consistency updates
      const intervalId = setInterval(() => {
         navigator.geolocation.getCurrentPosition(sendLocation, () => {}, { enableHighAccuracy: true });
      }, 10000);
      return () => {
         if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
         }
         clearInterval(intervalId);
      };
   }, [orders, tracking]);

   const handleUpdateStatus = async (orderId: string, status: string) => {
      try {
         await axios.put(`${Api_URL}/delivery/my-deliveries/${orderId}/status`, { status }, getAuthHeader());
         toast.success(`Status updated to ${status} successfully!`);
         fetchOrders();
      } catch (error: any) {
         toast.error(error.response?.data?.message || 'Failed to update status');
      }
   };

   const handleComplete = async () => {
      if (!otpModal || !otp) return;
      setSubmitting(true);
      try {
         await axios.put(`${Api_URL}/delivery/my-deliveries/${otpModal}/complete`, { otp }, getAuthHeader());
         toast.success('Delivery completed successfully!');
         setOtpModal(null);
         setOtp('');
         fetchOrders();
      } catch (error: any) {
         toast.error(error.response?.data?.message || 'Failed to complete delivery');
      } finally {
         setSubmitting(false);
      }
   };

   const handleCancel = async () => {
      if (!cancelModal) return;
      setSubmitting(true);
      try {
         await axios.put(`${Api_URL}/delivery/my-deliveries/${cancelModal}/cancel`, { reason: cancelReason }, getAuthHeader());
         toast.success('Delivery cancelled successfully!');
         setCancelModal(null);
         setCancelReason('');
         fetchOrders();
      } catch (error: any) {
         toast.error(error.response?.data?.message || 'Failed to cancel delivery');
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <div className='space-y-6'>
         {/* Tabs + Tracking toggle */}
         <div className='flex items-center gap-2 flex-wrap'>
            {(['active', 'completed'] as const).map((t) => (
               <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${tab === t ? 'bg-app-green text-white' : 'bg-white text-zinc-600 hover:bg-app-cream border border-app-border'}`}>
                  {t === 'active' ? 'Active' : 'Completed'}
               </button>
            ))}
            <div className='ml-auto'>
               <button
                  onClick={() => setTracking((prev) => !prev)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5 ${tracking ? 'bg-green-600 text-white' : 'bg-white text-zinc-600 border border-app-border hover:bg-app-cream'}`}>
                  <NavigationIcon className={`w-3.5 h-3.5 ${tracking ? 'animate-pulse' : ''}`} />
                  {tracking ? 'Sharing Location' : 'Share Location'}
               </button>
            </div>
         </div>

         {/* Orders */}
         {loading ? (
            <Loading />
         ) : orders.length === 0 ? (
            <div className='text-center py-16 bg-white rounded-2xl border border-app-border'>
               <PackageIcon className='size-12 text-app-border mx-auto mb-3' />
               <p className='text-lg font-semibold text-zinc-900 mb-1'>No {tab} deliveries</p>
               <p className='text-sm text-zinc-500'>{tab === 'active' ? "You'll see new assignments here" : 'Completed deliveries will appear here'}</p>
            </div>
         ) : (
            <div className='space-y-4'>
               {orders.map((order) => (
                  <DeliveryOrderCard key={order.id} order={order} tab={tab} handleUpdateStatus={handleUpdateStatus} setOtpModal={setOtpModal} setCancelModal={setCancelModal} />
               ))}
            </div>
         )}

         {/* OTP Modal */}
         {otpModal && <OtpModal setOtpModal={setOtpModal} otp={otp} setOtp={setOtp} handleComplete={handleComplete} submitting={submitting} />}
         {/* Cancel Modal */}
         {cancelModal && <CancelModal setCancelModal={setCancelModal} cancelReason={cancelReason} setCancelReason={setCancelReason} handleCancel={handleCancel} submitting={submitting} />}
      </div>
   );
}
