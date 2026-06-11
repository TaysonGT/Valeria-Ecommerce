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
import { LuFilter } from 'react-icons/lu';

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
        <div className='sm:flex-6 flex flex-col border-l font-[Poppins] border-gray-300'>
            <div className='sm:py-8 py-6 md:px-10 px-4 sm:px-6 flex flex-row flex-wrap justify-between items-end border-b gap-4 border-gray-300'>
                <form onSubmit={searchSubmitHandler} className="relative flex gap-2 w-full sm:w-auto">
                    <div className="relative grow">
                        <div className="absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none">
                            <IoSearch className='text-indigo-400'/>
                        </div>
                        <input type="search" onChange={(e)=>setSearchString(e.target.value)} value={searchString} id="search" className="z-2 block sm:w-140 w-full p-3 ps-9 border border-[#b7b7b7] rounded-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-[#b7b7b7]" placeholder="Search by product ID or name" />
                        <div onClick={()=>setSearchString('')} className="z-3 absolute cursor-pointer inset-y-0 inset-e-0 flex items-center pe-3">
                            <IoClose className='text-indigo-400'/>
                        </div>
                    </div>
                    <button type='submit' className='px-4 py-2 bg-black cursor-pointer text-white rounded-sm font-bold font-[Elms_Sans]'>Search</button>
                </form>
                <div className='flex sm:gap-6 gap-4 text-sm flex-wrap'>
                    <button onClick={()=>{
                        window.dispatchEvent(new Event('toggle-filters'))
                    }} className='px-4 py-3 self-end bg-primary-600 md:hidden text-white border rounded-lg flex items-center gap-2 text-sm'>
                        <LuFilter className='text-xl'/>
                        Filters
                    </button>
                    <div>
                        <label className='block'>Sort By</label>
                        <select onChange={handleSort} name='sort' defaultValue={searchParams.get('sort')||'none'} className='p-1 border border-black rounded-sm'>
                            <option value="none">None</option>
                            <option value="name">Name</option>
                            <option value="price">Price</option>
                        </select>
                    </div>
                    <div>
                        <label className='block'>Sort Order</label>
                        <select onChange={handleSort} name='order' disabled={!searchParams.get('sort')} className={`p-1 border border-black rounded-sm ${!searchParams.get('sort')&& 'border-gray-400 text-gray-500 cursor-not-allowed'}`}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                    <div>
                        <label className='block'>Per Page</label>
                        <select onChange={handleSort} name='pagination' className='p-1 border border-black rounded-sm'>
                            <option value="10">10 Items</option>
                            <option value="20">20 Items</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className='sm:px-10 sm:py-6 p-4 grow'>
                {isLoading?
                <>
                    <LightBackground />
                    <Loader className='fixed left-1/2 top-1/2 -translate-1/2' {...{size: 70, thickness:10, speed: 1}}/>
                </>
                :
                results.length?
                <div className='h-full flex flex-col gap-10'>
                    <div className='grid lg:grid-cols-3 xl:grid-cols-4 grid-cols-1 min-[420px]:grid-cols-2 gap-2 sm:gap-4'>
                        {results.map((product)=>
                            <ProductCard  key={product._id} {... {product}} autoWidth />
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