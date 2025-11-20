import React from 'react'
import ProductCard from './ProductCard'
import { productType } from '../../types/types';
import ProductsNav from './ProductsNav';
import { useSearch } from '../../context/SearchContext';
import { FaArrowLeft } from 'react-icons/fa';
import Loader from '../../components/Loader';
import LightBackground from '../../components/LightBackground';
import { filterType } from './Products';

interface Props {
    results: productType[];
    isLoading: boolean;
    filters: filterType[];
}

const ProductsList: React.FC<Props> = ({results, isLoading, filters})=>{

    const {handleSort, searchParams, maxPages, setSearchParams} = useSearch()

    return (
        <div className='w-4/5 flex flex-col'>
            <div className='py-4 px-10 flex justify-between items-end border-b border-gray-300'>
                {searchParams.get('q')&& <div className='text-2xl'>Results for: "{searchParams.get('q')}"</div>}
                <div className='flex gap-10'>
                    <div>
                        <label className='block'>Sort By:</label>
                        <select onInput={handleSort} name='sort' className='p-2 border border-black rounded-sm'>
                            <option value="none">None</option>
                            <option value="name" selected={searchParams.get('sort')=="name"}>Name</option>
                            <option value="price" selected={searchParams.get('sort')=="price"}>Price</option>
                        </select>
                    </div>
                    <div>
                        <label className='block'>Sort Order:</label>
                        <select onInput={handleSort} name='order' disabled={!searchParams.get('sort')} className={`p-2 border border-black rounded-sm ${!searchParams.get('sort')&& 'border-gray-400 text-gray-500 cursor-not-allowed'}`}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                    <div>
                        <label className='block'>Per Page:</label>
                        <select onInput={handleSort} name='pagination' className='p-2 border border-black rounded-sm'>
                            <option value="10">10 Items</option>
                            <option value="20">20 Items</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className='px-10 py-4 h-full'>
                {isLoading?
                <>
                    <LightBackground />
                    <Loader className='fixed left-1/2 top-1/2 -translate-1/2' {...{size: 70, thickness:10, speed: 1}}/>
                </>
                :
                results.length?
                <div className='h-full flex flex-col gap-10'>
                    <div className='flex flex-wrap gap-8 '>
                    {results.map((product)=>
                        <ProductCard key={product._id} {... {product}} />
                    )}
                    </div>
                    <ProductsNav/>
                </div>
                    :
                    maxPages<parseInt(searchParams.get('page')||'1') && maxPages!==0?
                    <p className='flex items-center gap-2 cursor-pointer select-none' onClick={()=>{
                        searchParams.set('page', maxPages.toString())
                        setSearchParams(searchParams)
                    }}><FaArrowLeft/> Go Back</p>
                :filters.length?
                    <>
                        <p className='text-2xl font-bold'>No products matched all filters</p>
                        <p className='text-gray-600'>Try removing some filters.</p>
                    </>
                :
                    <p className='text-gray-600'>No Results Matching "{decodeURIComponent(searchParams.get('q')||"")}"</p>
                }
            </div>
        </div>
    )
}

export default ProductsList