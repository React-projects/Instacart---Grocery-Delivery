import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CardContext';
import { dummyAddressData } from '../assets/assets';
import type { Address } from '../types';
import { ArrowLeftIcon, CheckIcon, ChevronRight, ChevronRightIcon, CreditCardIcon, MapPinIcon } from 'lucide-react';
import CheckoutAddress from '../components/Checkout/CheckoutAddress';
import CheckoutPayment from '../components/Checkout/CheckoutPayment';
import CheckoutReview from '../components/Checkout/CheckoutReview';

const Checkout = () => {
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$';
    const [step, setStep] = useState('address');
    const [loading, Setloading] = useState(false);
    const { items, cartTotal } = useCart();
    const { user } = { user: { addresses: dummyAddressData } };
    const [address, setAddress] = useState<Address>({
        _id: '',
        label: 'Home',
        address: '',
        city: '',
        state: '',
        zip: '',
        isDefault: false,
        lat: 0,
        lng: 0,
    });
    const [paymentMethod, setPaymentMethod] = useState('card');
    const deliveryFee = cartTotal > 20 ? 0 : 1.99;
    const tax = cartTotal * 0.08;
    const totalAmount = cartTotal + deliveryFee + tax;
    const steps: { key: string; label: string; icon: typeof MapPinIcon }[] = [
        {
            key: 'address',
            label: 'Address',
            icon: MapPinIcon,
        },
        {
            key: 'payment',
            label: 'Payment',
            icon: CreditCardIcon,
        },
        {
            key: 'review',
            label: 'Review',
            icon: CheckIcon,
        },
    ];
    const handlePlaceOrder = () => {
        Setloading(true);
        navigate('/orders');
    };
    // populate  Address for user make it default Address
    useState(() => {
        if (user && user.addresses && user.addresses.length > 0) {
            const defaultAddress = user.addresses.find((addr: Address) => addr.isDefault) || user.addresses[0];
            setAddress({
                _id: defaultAddress._id,
                label: defaultAddress.label,
                address: defaultAddress.address,
                city: defaultAddress.city,
                state: defaultAddress.state,
                zip: defaultAddress.zip,
                isDefault: false,
                lat: defaultAddress.lat || 0,
                lng: defaultAddress.lng || 0,
            });
        }
    });
    if (items.length === 0) {
        return (
            <div className="flex-center bg-app-cream min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold  text-app-green mb-3">Your cart is empty</h2>
                    <p className="text-sm text-app-text-light mb-3 ">Please add items to your cart before checking out</p>
                    <button onClick={() => navigate('/products')} className="px-4 py-2 bg-app-green text-white text-sm font-semibold rounded-xl hover:bg-app-green-light transition-colors">
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-app-cream">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-app-text-light hovertext-app-green mb-6 transition-colors">
                    <ArrowLeftIcon className="siz-4" /> Back
                </button>
                <h1 className="text-2xl font-semibold text-app-green mb-6">Checkout</h1>
                {/* Steps */}
                <div className="flex items-center gap-2 mb-8">
                    {steps.map((s, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <button onClick={() => setStep(s.key)} className={` flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${step === s.key ? 'bg-app-green text-white' : 'bg-white text-app-text-light'}`}>
                                <s.icon className="size-4" />
                                {s.label}
                                {index < steps.length - 1 && <ChevronRightIcon className="siz-4 text-app-text-light" />}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {/* main Form */}
                    <div className="md:col-span-2">
                        {step === 'address' && <CheckoutAddress user={user} address={address} setAddress={setAddress} setStep={setStep} />}
                        {step === 'payment' && <CheckoutPayment paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} setStep={setStep} />}
                        {step === 'review' && <CheckoutReview items={items} address={address} handlePlaceOrder={handlePlaceOrder} loading={loading} total={totalAmount} />}
                    </div>
                    {/* order summary sidebar */}
                    <div className="bg-white rounded-2xl p-5 h-fit sticky top-24">
                        <h3 className="text-sm font-semibold text-app-green mb-4">Order Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="border-t border-app-border my-4 pt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-app-text-light">Subtotal</p>
                                    <p className="text-sm font-semibold">${cartTotal.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-app-text-light">Delivery Fee</p>
                                    <p className="text-sm font-semibold">{deliveryFee === 0 ? 'Free' : `$ ${deliveryFee.toFixed(2)}`}</p>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-app-text-light">Tax</p>
                                    <p className="text-sm font-semibold">${tax.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center justify-between font-bold text-lg mt-4">
                                    <p>Total</p>
                                    <p>${totalAmount.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
