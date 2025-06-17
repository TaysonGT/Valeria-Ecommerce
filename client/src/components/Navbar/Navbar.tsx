import React, { useEffect, useRef, useState } from 'react'
import { createSearchParams, Link, useLocation, useNavigate } from 'react-router-dom'
import { RiAccountCircleLine } from "react-icons/ri";
import { MdOutlineShoppingBag, MdOutlineFavoriteBorder, MdOutlineSearch, MdClose } from "react-icons/md";
import { FaArrowRight, FaSearch } from 'react-icons/fa';

 const links = [
  {
    name: "Home",
    path: "/"
  },
  {
    name: "Collections",
    path: "/",
    children: [
      {
        text: "Winter Collection",
        path: "/",
        children: [
          {
            text: "Men's Wear",
            path: "/",
          },
          {
            text: "Women's Wear",
            path: "/",
          },
          {
            text: "Kids' Wear",
            path: "/",
          },
        ]
      },
      {
        text: "Summer Collection",
        path: "/",
        children: [
          {
            text: "Men's Shirts",
            path: "/",
          },
          {
            text: "Men's Shades",
            path: "/",
          },
          {
            text: "Kids' Trousers",
            path: "/",
          },
        ]
      },
      {
        text: "Men's Collection",
        path: "/",
        children: [
          {
            text: "Apparel",
            path: "/",
          },
          {
            text: "Accessories",
            path: "/",
          },
          {
            text: "Pajamas",
            path: "/",
          },
          {
            text: "Sweatshirts",
            path: "/",
          },
        ]
      },

    ]
  },
  {
    name: "About",
    path: "/",
  },
  {
    name: "Contact",
    path: "/",
  }
 ]

const Navbar: React.FC = () => {
  let location = useLocation()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  // const { token, currentUser, resetAuth } = useAuth()
  const [currentLocation, setCurrentLocation] =  useState(location)  
  const [searchString, setSearchString] = useState<string>('')
  const [searchbar, setSearchbar] = useState<boolean>(false)

  const handleSearch = (e:React.FormEvent<HTMLFormElement>)=> {
    e.preventDefault(); 
    navigate(`/products?q=${encodeURIComponent(searchString)}`)
    setSearchbar(false)
  }

  useEffect(()=>{
    setCurrentLocation(location)
    inputRef.current!.value = ''
  },[location])


  return ( 
    <div className='bg-black relative text-white w-full'>
      <div 
        className={'w-screen h-screen fixed top-full left-0 z-[99] bg-white opacity-0 duration-300 '+ (searchbar&& '-translate-y-full opacity-30')} 
        onClick={()=>setSearchbar(false)}>
      </div>
      <div className={'bg-white text-black w-full top-0 absolute py-4 z-[100] -translate-y-full duration-300 '+ (searchbar&& 'translate-y-0')}>
        <MdClose className='ml-auto mr-10 mb-2 text-2xl hover:text-red-500 duration-200 cursor-pointer' onClick={()=>setSearchbar(false)}/>
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
      <div className='flex justify-between items-center w-[90%] m-auto py-4'>
        <Link to='/'><h1 className='text-4xl font-[Comfortaa] font-extrabold select-none hover:text-[#418791] duration-300'>Valeria</h1></Link>
        <ul className='flex gap-12 text-md justify-center items-center'>
          {links.map((link, i)=>
            <div key={i} className='group-hover:text-[#418791] duration-150 relative group/primary select-none z-[9]  cursor-pointer'>
              <Link className='inline-block py-3' to={link.path}>{link.name}</Link>
              {link.children&&
              <div className='absolute group-hover/primary:opacity-100 group-hover/primary:top-[100%] group-hover/primary:scale-y-100 origin-top scale-y-95 pointer-events-none group-hover/primary:pointer-events-auto opacity-0 top-[80%] bg-white text-black shadow-lg text-sm duration-400'>
                {link.children.map((child, x)=> 
                  <div key={x} className='relative border-t border-gray-400 text-nowrap group/secondary'>
                    <Link className='p-4 gap-3 flex justify-between items-center' to={child.path}>
                      {child.text}
                      <FaArrowRight className='text-xs'/>
                    </Link>
                  {child.children&&
                  <>
                    <div className='absolute left-[90%] -top-[1px] shadow-lg opacity-0 group-hover/secondary:opacity-100 group-hover/secondary:left-[100%] bg-white text-black text-sm duration-400 '>
                      {child.children.map((grandchild, y)=>
                        <Link key={y} to={grandchild.path} className='flex relative justify-between items-center p-4 border-t gap-3 border-gray-400 text-nowrap'>
                          {grandchild.text}
                        </Link>
                      )}
                    </div>
                  </>
                  }
                  </div>
                )}
              </div>
              }
            </div>
          )}
        </ul>
        <div className='flex items-center gap-6'>
          <MdOutlineSearch onClick={()=>{setSearchbar(true); inputRef.current!.focus()}} className='cursor-pointer text-[25px] hover:scale-[1.15] duration-200'/>
          <Link to='/'><MdOutlineFavoriteBorder className='text-[25px] hover:scale-[1.15] duration-200'/></Link>
          <Link to='/'><RiAccountCircleLine className='text-[25px] hover:scale-[1.15] duration-200'/></Link>
          <Link className='group relative' to='/'>
            <MdOutlineShoppingBag className='text-[25px] group-hover:scale-[1.15] duration-200 '/>
            <span className='absolute -top-1 -left-2 text-[12px] bg-[#eab308] text-[#fff] font-bold rounded-full w-4.5 h-4.5 flex justify-center items-center'>0</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Navbar