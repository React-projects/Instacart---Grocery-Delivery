import { CheckIcon, MapPinIcon, PencilIcon, TrashIcon } from 'lucide-react';
import type { Address } from '../../types';

interface AddersCardProps {
    addr: Address;
    onEditHandler: (addr: Address) => void;
    setAddresses: (address: Address[]) => void;
}
const AddressCard = ({ addr, onEditHandler, setAddresses }: AddersCardProps) => {
    const handleDelete = (id: string) => {
        console.log('Delete address with id:', id);
    };
    return (
       <div key={addr.id} className='max-w-3xl bg-white rounded-2xl p-6 flex items-start justify-between'>
          {/* left side */}
          <div className='flex gap-4'>
             <div className="size-10 rounded-xl bg-app-cream flex-center shrink-0' >">
                <MapPinIcon className='size-5 text-app-green' />
             </div>
             <div className='flex flex-col gap-1'>
                <div className='flex item-center gap-2 mb-1'>
                   <p className='text-sm font-semibold text-app-green'>{addr.label}</p>
                   {addr.isDefault && (
                      <span className='flex-center gap-1 px-2.5 py-0.5 text-[10px] font-medium bg-app-green text-white rounded-full '>
                         <CheckIcon className='size-2.5' />
                         Default
                      </span>
                   )}
                </div>
                <p className='text-sm text-app-text-light'>
                   {addr.address}, {addr.city} <br />, {addr.state} {addr.zip}
                </p>
             </div>
          </div>
          {/* Right side */}
          <div className='flex items-center gap-1'>
             <button onClick={() => onEditHandler(addr)} className='p-2  text-app-text-light  hover:text-app-green  hover:bg-app-cream round-lg transition-colors'>
                <PencilIcon className='size-4' />
             </button>
             <button onClick={() => handleDelete(addr.id)} className='p-2  text-app-text-light  hover:text-app-error  hover:bg-red-50 round-lg transition-colors'>
                <TrashIcon className='size-4' />
             </button>
          </div>
       </div>
    );
};

export default AddressCard;
