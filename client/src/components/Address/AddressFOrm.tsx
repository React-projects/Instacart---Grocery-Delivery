import { XIcon } from 'lucide-react';

const AddressFOrm = ({ restForm, handelSubmit, form, setform, editingId }: any) => {
    return (
        <>
            {/* {/ * overlay * /} */}
            <div className="fixed inset-0 bg-black/40 z-50" />
            {/* form container */}
            <div onClick={restForm} className="fixed inset-0 z-50 flex-center p-4">
                <form onClick={e => e.stopPropagation()} onSubmit={handelSubmit} className=" bg-white rounded-2xl w-full max-w-lg p-6  animate-fade-in">
                    {/* Form HHeader */}
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-semibold text-app-green">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
                        <button type="button" onClick={restForm} className="p-2 rounded-lg hover:text-app-cream">
                            <XIcon onClick={restForm} className="size-5" />
                        </button>
                    </div>
                    {/* form inputs fids4e */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="label" className="block text-sm font-medium text-app-green mb-1.5">
                                Address Label
                            </label>
                            <input required type="text" id="label" value={form.label} onChange={e => setform({ ...form, label: e.target.value })} className=" w-full border text-sm border-app-border rounded-xl py-2.5 px-4 focus:border-app-green outline-none " placeholder="Home ,work etc" />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-app-green mb-1.5">
                                Street Address
                            </label>
                            <input required type="text" id="address" value={form.address} onChange={e => setform({ ...form, address: e.target.value })} className=" w-full border text-sm border-app-border rounded-xl py-2.5 px-4 focus:border-app-green outline-none " placeholder="123 Main St" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-app-green mb-1.5">
                                    City
                                </label>
                                <input required type="text" id="city" value={form.city} onChange={e => setform({ ...form, city: e.target.value })} className=" w-full border text-sm border-app-border rounded-xl py-2.5 px-4 focus:border-app-green outline-none " placeholder="New York" />
                            </div>
                            <div>
                                <label htmlFor="state" className="block text-sm font-medium text-app-green mb-1.5">
                                    State
                                </label>
                                <input required type="text" id="state" value={form.state} onChange={e => setform({ ...form, state: e.target.value })} className="w-full border text-sm border-app-border rounded-xl py-2.5 px-4 focus:border-app-green outline-none " placeholder="NY" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="zip" className="block text-sm font-medium text-app-green mb-1.5">
                                ZIP Code
                            </label>
                            <input required type="text" id="zip" value={form.zip} onChange={e => setform({ ...form, zip: e.target.value })} className="w-full border text-sm border-app-border rounded-xl py-2.5 px-4 focus:border-app-green outline-none " placeholder="10001" />
                        </div>
                        <div className="flex items-end pb-1">
                            <label htmlFor="zip" className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" onChange={e => setform({ ...form, isDefault: e.target.checked })} checked={form.isDefault} />
                                <span className="text-sm text-app-text">set as default</span>
                            </label>
                        </div>
                        {/* Button submit */}
                        <div className="flex justify-end gap-3 mt-6">
                            <button type="button" onClick={restForm} className="px-4 py-2 border border-app-border text-app-text-light hover:bg-app-cream rounded-xl transition-colors">
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 bg-app-green text-white text-sm font-semibold rounded-xl hover:bg-app-green-light transition-colors">
                                {editingId ? 'Update Address' : 'Add Address'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddressFOrm;
