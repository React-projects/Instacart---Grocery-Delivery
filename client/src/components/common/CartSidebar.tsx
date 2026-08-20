import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CardContext';
import { ArrowRightIcon, MinusIcon, PlusIcon, ShoppingBagIcon, TrashIcon, XIcon } from 'lucide-react';

const CartSidebar = () => {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$';
    const { items, updateQuantity, removeFromCart, cartTotal, cartOpen, setCartOpen } = useCart();
    const navigate = useNavigate();
    if (!cartOpen) return null;
    const deliveryFee = cartTotal > 20 ? 0 : 1.99;
    const cartTotalWithDelivery = cartTotal + deliveryFee;
    return (
       <>
          <div onClick={() => setCartOpen(false)} className='inset-0 bg-black/40 fixed z-50 transition-opacity' aria-hidden='true' />
          {/* { / • Sidebar • / } */}
          <div className='fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right'>
             {/* { Header } */}
             <div className='flex items-center justify-between p-5 border-b border-app-border'>
                <div className='flex  items-center gap-2'>
                   <ShoppingBagIcon className='size-5' />
                   <h2 className='text-lg font-mediums'>Your Cart</h2>
                   <span className='py-0.5 px-2 text-xs font-semibold bg-app-cream rounded-full'> {items.length} items</span>
                </div>
                <button onClick={() => setCartOpen(false)}>
                   <XIcon className='size-5' />
                </button>
             </div>
             {/* { items } */}
             <div className='flex-1 overflow-y-auto p-5 space-y-4'>
                {items.length === 0 ? (
                   <div className='flex flex-col items-center justify-center h-full text-center'>
                      <ShoppingBagIcon className='size-16 text-app-border mb-4' />
                      <h4 className='text-lg font-medium mb-1'>Your cart is empty</h4>
                   </div>
                ) : (
                   items.map((item) => (
                      <div key={item.product.id} className='flex gap-3 bg-app-cream/60 rounded-xl p-3'>
                         <img src={item.product.image} alt={item.product.name} className='size-16 object-cover rounded-lg shrink-0r-0' />
                         <div className='flex not-first:min-w-0'>
                            <h4 className=' text-sm font-semibold truncate'>{item.product.name}</h4>
                            <p className='text-xs text-app-text-light '>
                               {currency}
                               {item.product.price.toFixed(2)}/{item.product.unit}
                            </p>
                            <div className='flex items-center justify-between mt-2'>
                               <div className='flex items-center gap-1.5'>
                                  <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className=' size-7 rounded-lg bg-white border border-app-border flex-center'>
                                     <MinusIcon className='size-3' />
                                  </button>
                                  <span className='text-sm font-semibold w-6 text-center'>{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className='size-7 rounded-lg bg-white border border-app-border flex-center'>
                                     <PlusIcon className='size-3' />
                                  </button>
                               </div>
                               <div className='flex item-center gap-2'>
                                  <span onClick={() => removeFromCart(item.product.id)} className='text-sm font-semibold'>
                                     {currency}
                                     {(item.product.price * item.quantity).toFixed(2)}
                                  </span>
                                  <button onClick={() => removeFromCart(item.product.id)} className='p-1 text-app-text-light hover:text-app-error transition-colors'>
                                     <TrashIcon className='size-4' />
                                  </button>
                               </div>
                            </div>
                         </div>
                      </div>
                   ))
                )}
             </div>
             {/* { Footer } */}
             {items.length > 0 && (
                <div className='p-5 border-t border-app-border space-y-3'>
                   <div className='flex justify-between text-sm'>
                      <span className='text-app-text-light-light'>Total:</span>
                      <span className='font-medium'>
                         {currency}
                         {cartTotal.toFixed(2)}
                      </span>
                   </div>
                   <div className='flex justify-between text-sm'>
                      <span className='text-app-text-light-light'>Delivery:</span>
                      <span className='font-medium'>{deliveryFee === 0 ? <span className='text-app-success'> Free</span> : `${currency}${deliveryFee.toFixed(2)}`}</span>
                   </div>
                   {deliveryFee > 0 && <p className='text-xs text-app-text-light-light text-center'> Free delivery on orders over {currency}20 !</p>}
                   <div className='flex justify-between text-base font-semibold border-t border-app-border'>
                      <span>total:</span>
                      <span>
                         {currency}
                         {cartTotalWithDelivery.toFixed(2)}
                      </span>
                   </div>
                   <button
                      onClick={() => {
                         setCartOpen(false);
                         navigate('/checkout');
                         window.scrollTo(0, 0);
                      }}
                      className=' w-full py-3 bg-app-orange text-white font-semibold rounded-xl hover:bg-app-orange-dark transition-colors flex-center gap-2 active:scale-[0.98]'>
                      Proceed to Checkout <ArrowRightIcon className='size-4' />
                   </button>
                </div>
             )}
          </div>
       </>
    );
};
export default CartSidebar;
