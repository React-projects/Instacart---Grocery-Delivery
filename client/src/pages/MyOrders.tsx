import { useEffect, useState } from 'react';
import type { Order } from '../types';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CardContext';
import { dummyDashboardOrdersData, statusColors } from '../assets/assets';
import Loading from '../components/common/Loading';
import { CalendarHeartIcon, ChevronRightIcon, PackageIcon } from 'lucide-react';

const MyOrders = () => {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$';
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchParam, setSearchParam] = useSearchParams();
    const tabs = ['all', 'placed', 'delivered', 'out of delivery'];

    const { clearCart } = useCart();
    const fetchOrders = async () => {
        setOrders(dummyDashboardOrdersData as any);
        setLoading(false);
    };
    useEffect(() => {
        if (searchParam.get('clearCart')) {
            clearCart();
            setSearchParam('');
            fetchOrders();
            setTimeout(() => {
                fetchOrders();
            }, 2000);
        } else {
            fetchOrders();
        }
    }, [activeTab]);

    return (
       <div className='min-h-screen bg-app-cream mb-20'>
          <div className=' max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
             <h1 className='text-2xl font-semibold text-app-green mb-6'>My Orders</h1>
             {/* Tabs */}

             <div className='flex gap-2 mb-6 overflow-x-auto pb-2'>
                {tabs.map((tab) => (
                   <button
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-app-green text-white' : 'bg-white text-app-text-light hover:bg-app-cream'}`}
                      key={tab}>
                      {tab === 'All' ? 'All Orders' : tab}
                   </button>
                ))}
             </div>
             {/* OrderList */}
             {loading ? (
                <Loading />
             ) : orders.length === 0 ? (
                <div className='text-center py-16'>
                   <PackageIcon className='size-16 text-app-border mx-auto mb-4' />
                   <h2 className='text-lg font-medium text-app-green mb-2'>No Orders Found</h2>
                   <p className='text-sm  text-app-text-light mb-4'>Start shopping and start adding to see order details</p>
                   <Link to='/products' className=' inline-flex px-4 py-2 bg-app-green text-white text-sm rounded-lg '>
                      Start Shopping
                   </Link>
                </div>
             ) : (
                <div className='space-y-4'>
                   {orders.map((order) => (
                      <Link key={order.id} to={`/orders/${order.id}`} className='block max-w-4xl bg-white rounded-2x; p-5 hover:shadow transition-all'>
                         {/* {/ * order id, date & status*/}
                         <div className='flex items-center justify-between mb-3'>
                            {/* left side content */}
                            <div>
                               <p className='text-sm text-app-green font-medium'>Order # {order.id.slice(-8).toUpperCase()}</p>
                               <div className='flex items-center gap-2 mt-1'>
                                  <CalendarHeartIcon className='size-6 text-app-border' />
                                  <span className='text-app-text-light text-xs'>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                               </div>
                            </div>

                            {/* right side content */}
                            <div className='flex items-center gap-2 '>
                               <span className={`px-4 py-2 text-sm font-medium rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
                               <ChevronRightIcon className='size-6 text-app-text-light' />
                            </div>
                         </div>
                         {/* { / * Item thumbnails * / } */}
                         <div className='flex items-center gap-2 mb-3'>
                            {order.items.slice(0, 4).map((item, i) => (
                               <img key={i} src={item.image} alt={item.name} className='size-12 sm:size-16 rounded-lg object-cover border border-app-border' />
                            ))}
                            {order.items.length > 4 && (
                               <div className='size-12 sm:size-16 rounded-lg bg-app-cream flex-center text-xs font-semibold text-app-text-light'>+{order.items.length - 4}</div>
                            )}
                         </div>
                         {/* { / * total items & price */}
                         <div className='flex items-center justify-between pt-3  text-sm'>
                            <span className='text-app-text-light'>{order.items.length} items</span>
                            <span className='font-semibold text-app-green'>
                               {currency}
                               {order.total.toFixed(2)}
                            </span>
                         </div>
                      </Link>
                   ))}
                </div>
             )}
          </div>
       </div>
    );
};

export default MyOrders;
