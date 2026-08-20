import { ArrowUpRight, ArrowUpRightIcon, BikeIcon, ChevronDown, ChevronDownIcon, LogOutIcon, MapPinIcon, MenuIcon, PackageIcon, SearchIcon, ShieldIcon, ShoppingCartIcon, User, UserIcon, X, XIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CardContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount, setCartOpen } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const handleSearchSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };
    const handleLogout = () => {
        // Your logout logic here (e.g., clear user session, redirect to login page)
        logout();
        setUserMenuOpen(false);
        navigate('/');
    };

    return (
        <nav className=" bg-white sticky top-0 z-50 border-b border-app-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-y-44">
                {/* Logo */}
                <Link className=" flex items-center gap-2 text-(22px) font-medium shrink-0" to="/">
                    <BikeIcon className="size-8" /> Instacart
                </Link>
                {/* NEVIGATION */}
                <div className="w-full flex items-center justify-end gap-4 lg:gap-10">
                    {/* navigation for desktop */}
                    <div className="hidden md:flex items-center gap-6 text-sm text-zinc-600'">
                        <Link to="/" className="hover:text-app-green transition-colors">
                            Home
                        </Link>
                        <Link to="/products" className="hover:text-app-green transition-colors">
                            {' '}
                            Products
                        </Link>
                        <Link to="/deals" className="text-app-orange">
                            Deals
                        </Link>
                    </div>
                    {/* Search */}
                    <form onSubmit={handleSearchSubmit} className="hidden sm:flex flex-1 max-w-sm text-xs sm:text-sm">
                        <div className="relative w-full">
                            <SearchIcon className="absolute icon left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                            <input type="text" placeholder="Search for products" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className=" w-full pl-8 p-2 bg-orange-50 rounded-full ring ring-app-orange/15 focus:ring-app-orange > " aria-label="Search Products" />
                        </div>
                    </form>
                    {/* Right Action  */}
                    <div className="flex item-center gap-2">
                        {/* cart  */}
                        <button className="relative p-2 rounded-xl" onClick={() => setCartOpen(true)}>
                            <ShoppingCartIcon className="size-5 text-zinc-900" />
                            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-app-orange text-white text-(10px) w-4 h-4 flex-center rounded-full">{cartCount}</span>}
                        </button>
                        {/* user */}
                        <div className="relative">
                            {user ? (
                                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-2">
                                    <div className="rounded-full size-7 bg-green-950 text-white flex-center">{user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}</div>
                                    <ChevronDownIcon className="size-3 text-zinc-500" />
                                </button>
                            ) : (
                                <div className="flex-center gap-2">
                                    <Link to="/login" className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-950 rounded-full hover:bg-green-600 transition-colors">
                                        <UserIcon className="size-4" /> sign in
                                    </Link>

                                    {/* Mobile menu button */}
                                    <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="md:hidden">
                                        {userMenuOpen ? <XIcon className="size-5 text-zinc-500" /> : <MenuIcon className="size-5 text-zinc-500" />}
                                    </button>
                                </div>
                            )}
                            {/* Dropdown Menu - FIXED STRUCTURE */}
                            {userMenuOpen && (
                                <>
                                    {/* Backdrop overlay */}
                                    <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setUserMenuOpen(false)} />

                                    {/* Menu content - NOT inside the overlay div */}
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-app-border py-2 z-50 animate-fade-in">
                                        {user && (
                                            <div className="px-4 py-2 border-b border-app-border">
                                                <p className="text-sm font-medium text-zinc-900">{user?.name}</p>
                                                <p className="text-xs text-zinc-500">{user?.email}</p>
                                            </div>
                                        )}

                                        {!user && (
                                            <Link to="/login" className="dropdown-link" onClick={() => setUserMenuOpen(false)}>
                                                <UserIcon className="size-4" /> Sign In
                                            </Link>
                                        )}

                                        {user && (
                                            <Link to="/orders" className="dropdown-link" onClick={() => setUserMenuOpen(false)}>
                                                <PackageIcon className="size-4" /> My Orders
                                            </Link>
                                        )}

                                        {user && (
                                            <Link to="/addresses" className="dropdown-link" onClick={() => setUserMenuOpen(false)}>
                                                <MapPinIcon className="size-4" /> Address
                                            </Link>
                                        )}

                                        <Link to="/products" className="dropdown-link md:hidden" onClick={() => setUserMenuOpen(false)}>
                                            <ArrowUpRightIcon className="size-4" /> Products
                                        </Link>

                                        <Link to="/deals" className="dropdown-link md:hidden" onClick={() => setUserMenuOpen(false)}>
                                            <ArrowUpRightIcon className="size-4" /> Deals
                                        </Link>

                                        {user?.isAdmin && (
                                            <Link to="/admin/products" className="dropdown-link md:hidden" onClick={() => setUserMenuOpen(false)}>
                                                <ShieldIcon className="size-4 text-app-orange-dark" />
                                                <span className="text-app-orange-dark">Admin Panel</span>
                                            </Link>
                                        )}

                                        {user && (
                                            <div className="border-t border-app-border pt-1">
                                                <button
                                                    onClick={() => {
                                                        handleLogout();
                                                    }}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                                                >
                                                    <LogOutIcon className="size-4" /> Logout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
