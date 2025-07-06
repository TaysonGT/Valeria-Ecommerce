import React, { useEffect, useRef, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import { useLocation, useNavigate, useSearchParams } from 'react-router'

interface Props {
    setShowSearchbar: (arg0:boolean)=> void;
    showSearchbar: boolean;
}

const SearchBar:React.FC<Props> = ({setShowSearchbar, showSearchbar})=>{
    let location = useLocation()
    const navigate = useNavigate()

    const [searchString, setSearchString] = useState<string>('')
    const [currentLocation, setCurrentLocation] =  useState(location)  
    const [searchParams, setSearchParams] = useSearchParams()

    const inputRef = useRef<HTMLInputElement>(null)

    const handleSearch = (e:React.FormEvent<HTMLFormElement>)=> {
        e.preventDefault(); 
        searchParams.set('s', encodeURIComponent(searchString))
        setSearchParams(searchParams)
        navigate(`/products?${searchParams.toString()}`)
        setShowSearchbar(false)
    }
    
    useEffect(()=>{
        if(showSearchbar) inputRef.current!.focus()
    },[showSearchbar])

    useEffect(()=>{
        setCurrentLocation(location)
        inputRef.current!.value = ''
    },[location])
    
    return (
        <div className={`bg-white text-black w-full top-0 absolute py-4 z-[100] -translate-y-full duration-300 ${showSearchbar&& 'translate-y-0'}`}>
        <MdClose className='ml-auto mr-10 mb-2 text-2xl hover:text-red-500 duration-200 cursor-pointer' onClick={()=>setShowSearchbar(false)}/>
        <form
            onSubmit={handleSearch}  
            className='flex w-[90%] mx-auto gap-2'>
            <input className='border-b border-gray-700 focus:placeholder:opacity-0 duration-150 outline-none placeholder:text-gray-600 grow px-4 py-2' 
            placeholder='Search Products...' 
            type="search" 
            name="search" 
            id=""
            onInput={(e)=>setSearchString(e.currentTarget.value)} 
            ref={inputRef}
            />
            <button type='submit'>
            <FaSearch className='cursor-pointer'/>
            </button>
        </form>
        </div>
    )
}

export default SearchBar