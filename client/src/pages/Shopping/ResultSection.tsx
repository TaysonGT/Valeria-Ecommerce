import React, { useState } from 'react'
import ProductCard from '../../components/ProductCard'
import { productType } from '../../types';
import NavigationController from '../../components/ui/NavigationController';
import { useSearch } from '../../context/SearchContext';
import { FaArrowLeft } from 'react-icons/fa';
import Loader from '../../components/Loader';
import LightBackground from '../../components/LightBackground';
import { filterType } from '.';
import { IoClose, IoSearch } from 'react-icons/io5';

interface Props {
    results: productType[];
    isLoading: boolean;
    filters: filterType[];
}

const ResultSection: React.FC<Props> = ({results, isLoading, filters})=>{

    const {handleSort, searchParams, maxPages, pageCount, changePage, setSearchParams} = useSearch()
    const [searchString, setSearchString] = useState('')
    
    const searchSubmitHandler = (e:React.SubmitEvent<HTMLFormElement>)=> {
        e.preventDefault(); 
        const newParams = new URLSearchParams()
        if(!searchString) {
            newParams.delete('q')
        }else{
            newParams.set('q', encodeURIComponent(searchString))
        }
        setSearchParams(newParams)
    }

    return (
        <div className='flex-6 flex flex-col border-l font-[Poppins] border-gray-300'>
            <div className='py-4 px-10 flex justify-between items-end border-b border-gray-300'>
                <form onSubmit={searchSubmitHandler} className="relative flex gap-1">
                    <div className="relative">
                        <div className="absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none">
                            <IoSearch className='text-indigo-400'/>
                        </div>
                        <input type="search" onChange={(e)=>setSearchString(e.target.value)} value={searchString} id="search" className="z-2 block w-140 p-3 ps-9 border border-[#b7b7b7]  rounded-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-[#b7b7b7]" placeholder="Search by product ID or name" />
                        <div onClick={()=>setSearchString('')} className="z-3 absolute cursor-pointer inset-y-0 inset-e-0 flex items-center pe-3">
                            <IoClose className='text-indigo-400'/>
                        </div>
                    </div>
                    <button type='submit' className='px-4 py-2 bg-black cursor-pointer text-white rounded-sm font-bold font-[Elms_Sans]'>Search</button>
                </form>
                {/* {searchParams.get('q')&& <div className='text-2xl'>Results for: "{searchParams.get('q')}"</div>} */}
                <div className='flex gap-10'>
                    <div>
                        <label className='block'>Sort By:</label>
                        <select onChange={handleSort} name='sort' defaultValue={searchParams.get('sort')||'none'} className='p-2 border border-black rounded-sm'>
                            <option value="none">None</option>
                            <option value="name">Name</option>
                            <option value="price">Price</option>
                        </select>
                    </div>
                    <div>
                        <label className='block'>Sort Order:</label>
                        <select onChange={handleSort} name='order' disabled={!searchParams.get('sort')} className={`p-2 border border-black rounded-sm ${!searchParams.get('sort')&& 'border-gray-400 text-gray-500 cursor-not-allowed'}`}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                    <div>
                        <label className='block'>Per Page:</label>
                        <select onChange={handleSort} name='pagination' className='p-2 border border-black rounded-sm'>
                            <option value="10">10 Items</option>
                            <option value="20">20 Items</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className='px-10 py-6 grow'>
                {isLoading?
                <>
                    <LightBackground />
                    <Loader className='fixed left-1/2 top-1/2 -translate-1/2' {...{size: 70, thickness:10, speed: 1}}/>
                </>
                :
                results.length?
                <div className='h-full flex flex-col gap-10'>
                    <div className='flex flex-wrap gap-4'>
                    {results.map((product)=>
                        <ProductCard key={product._id} {... {product}} />
                    )}
                    </div>
                    <NavigationController {...{pageCount, maxPages, changePage}}/>
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

export default ResultSection