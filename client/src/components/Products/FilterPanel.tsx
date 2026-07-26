const FilterPanel = ({ categories, category, minprice, maxprice, updateFilters, hasFilters, clearFilters }) => {
    const categoryWithAll = [{ slug: '', name: 'All Categories' }, ...categories];
    return (
        <div className="space-y-6">
            {/* categories */}
            <div>
                <h3 className="text-sm font-semibold text-app-green mb-3">categories</h3>
                <div className="s-y-1.5">
                    {categoryWithAll.map((cat: any) => (
                        <button onClick={() => updateFilters('category', cat.slug)} className={` block w-full text-left px-3 py-2 text-sm rounded-md transition-all ${category === cat.slug ? 'bg-app-green text-white' : 'text-app-text-light hover:bg-app-cream'}`} key={cat.slug} onClick={() => updateFilters('category', cat.slug)}>
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* price Range  */}
            <div>
                <h3 className="text-sm font-semibold text-app-green mb-3">Price Range</h3>
                <div className="flex item-center gap-2">
                    <input
                        type="number"
                        placeholder="min"
                        value={minprice}
                        onChange={e => {
                            updateFilters('minprice', e.target.value);
                        }}
                        className=" w-full px-3 py-2 text-sm be-white rounded-lg border not-focus:border-app-border "
                    />
                    <span className="text-app-text-light">-</span>
                    <input
                        type="number"
                        placeholder="max"
                        value={maxprice}
                        onChange={e => {
                            updateFilters('maxprice', e.target.value);
                        }}
                        className=" w-full px-3 py-2 text-sm be-white rounded-lg border not-focus:border-app-border "
                    />
                </div>
            </div>
            {hasFilters && (
                <button onClick={clearFilters} className="w-full py-2 text-sm text-app-error hover:bg-red-50 rounded-lg transition-colors font-medium ">
                    Clear Filters
                </button>
            )}
        </div>
    );
};

export default FilterPanel;
