import React from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { useSearch } from '../../context/SearchContext';


const ProductsNav:React.FC = ()=>{
    const {pageCount, changePage, maxPages} = useSearch()
    
    return (
        <div className='flex gap-1 text-xl justify-center mt-auto'>
            <div onClick={()=>changePage('start')} className={`w-8 flex justify-center items-center border border-${pageCount>1? 'black cursor-pointer': 'gray-500 text-gray-500 cursor-not-allowed'}`}><MdKeyboardDoubleArrowLeft/></div>
            <div onClick={()=>changePage('previous')} className={`w-8 flex justify-center items-center border border-${pageCount>1? 'black cursor-pointer': 'gray-500 text-gray-500 cursor-not-allowed'}`}><MdKeyboardArrowLeft/></div>
            <div className='w-8 flex justify-center items-center border-b-2 border-black text-sm py-1'>{pageCount}</div>
            <div onClick={()=>changePage('next')} className={`w-8 flex justify-center items-center border border-${pageCount<maxPages? 'black cursor-pointer': 'gray-500 text-gray-500 cursor-not-allowed'}`}><MdKeyboardArrowRight/></div>
            <div onClick={()=>changePage('end')} className={`w-8 flex justify-center items-center border border-${pageCount<maxPages? 'black  cursor-pointer': 'gray-500 text-gray-500 cursor-not-allowed'}`}><MdKeyboardDoubleArrowRight/></div>
        </div> 
    )
}

export default ProductsNav