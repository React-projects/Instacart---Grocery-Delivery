import { useEffect, useState } from 'react';
import type { Address } from '../types';
import { dummyAddressData } from '../assets/assets';
import { MapMinusIcon, Plus, PlusIcon } from 'lucide-react';
import Loading from '../components/common/Loading';
import AddressCard from '../components/Address/AddressCard';
import AddressFOrm from '../components/Address/AddressFOrm';
import { useAuth } from '../context/AuthContext';

const Address = () => {
    const { updateUser } = useAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<String | null>(null);
    const [form, setForm] = useState({
        label: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        isDefault: false,
    });
    const resetForm = () => {
        setForm({
            label: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            isDefault: false,
        });
        setShowForm(false);
        setEditingId(null);
    };
    const getLocation = (retries = 3): Promise<{lat:number}> => {};
    const handelSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        try {
            const coords= await
        } catch {}

    };
    const editHandler = (address: Address) => {
        setForm({
            label: address.label,
            address: address.address,
            city: address.city,
            state: address.state,
            zip: address.zip,
            isDefault: address.isDefault,
        });
        setEditingId(address.id);
        setShowForm(true);
    };
    useEffect(() => {
        setAddresses(dummyAddressData);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);
    return (
       <div className='min-h-screen bg-app-cream'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
             <div className='flex items-center justify-between mb-8'>
                {/* Page HEader */}
                <h1 className='text-2xl font-semibold text-app-green'>My Addresses</h1>
                <button
                   onClick={() => {
                      resetForm();
                      setShowForm(true);
                   }}
                   className='px-4 py-2 bg-app-green text-white text-sm font-semibold rounded-xl hover:bg-app-green-light transition-colors flex items-center gap-2'>
                   <PlusIcon className='size-4 ' /> Add Address
                </button>
             </div>
             {/* Form MOdal */}
             {showForm && <AddressFOrm restForm={resetForm} handelSubmit={handelSubmit} form={form} setform={setForm} editingId={editingId} />}
             {/* Address List */}
             {loading ? (
                <Loading />
             ) : addresses.length === 0 ? (
                <div className='text-center py-16'>
                   {' '}
                   <MapMinusIcon className='size-16 text-app-border mx-auto mb-4' />
                   <h2 className='text-lg font-semibold text-app-green mb-2'>No Addresses Found</h2>
                   <p className='text-sm text-app-text-light'>You haven't added any addresses yet.</p>
                </div>
             ) : (
                <div className='space-y-4'>
                   {addresses.map((address) => (
                      <AddressCard key={address.id} addr={address} onEditHandler={editHandler} setAddresses={setAddresses} />
                   ))}
                </div>
             )}
          </div>
       </div>
    );
};

export default Address;
