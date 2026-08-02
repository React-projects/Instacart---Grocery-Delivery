import { useEffect, useState } from 'react';
import type { Product } from '../types';
import { Link, useSearchParams } from 'react-router-dom';
import { dummyProducts } from '../assets/assets';
import { HomeIcon, Search } from 'lucide-react';
import Loading from '../components/common/Loading';
import ProductCard from '../components/common/ProductCard';

const SearchResult = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchParam] = useSearchParams('');
    const query = searchParam.get('q') || '';
    useEffect(() => {
        if (!query) return;
        setLoading(true);
        setProducts(dummyProducts.filter(product => product.name.toLowerCase().includes(query.toLowerCase())) || dummyProducts.filter(product => product.name.toLowerCase().includes(query.toLowerCase())));
        setLoading(false);
    }, [query]);

    return (
        <div className="min-h-screen bg-app-cream">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* BreadCrumbs */}
                <nav className="flex items-center gap-2 text-sm text-app-text-light mb-6">
                    <Link to="/" className="hover:text-app-green transition-colors">
                        <HomeIcon className="size-4" />
                    </Link>{' '}
                    <span className="text-app-green">/</span>
                    <span className="text-app-green font-medium">Search Result</span>
                </nav>
                {/* Header */}
                <div className=" mb-8">
                    <h1 className="text-2xl font-semibold text-app-green mb-1"> Search Result for "{query}"</h1>
                    <p className="text-sm text-app-text-light">{loading ? 'Searching...' : `${products.length} products found`}</p>
                </div>

                {/* Result */}
                {loading ? (
                    <Loading />
                ) : products.length === 0 ? (
                    <div className="text-center py-22">
                        {' '}
                        <Search className="size-16 text-app-border mx-auto mb-4" />
                        <h2 className="text-lg font-semibold text-app-green mb-2"> No products found. </h2>
                        <p className="text-lg font-semibold text-app-green mb-2"> We couldn't find any products matching "{query}" in your search. </p>
                        <Link to="/products" className=" inline-flex items-center gap-2 px-4 py-2 bg-app-green text-white text-sm font-semibold rounded-xl hover:bg-app-green-light transition-colors ">
                            <HomeIcon className="size-4 " /> Go Back Home
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResult;
