import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { RiAccountCircleLine, RiMenuFill } from "react-icons/ri";
import { MdOutlineShoppingBag, MdOutlineFavoriteBorder, MdOutlineSearch } from "react-icons/md";
import { FaArrowRight } from 'react-icons/fa';
import SearchBar from '../SearchBar';
import LightBackground from '../LightBackground';
import DarkBackground from '../DarkBackground';
import Cart from '../Cart';

 const links = [
  {
    name: "Home",
    path: "/"
  },
  {
    name: "Collections",
    path: "/products",
    children: [
      {
        text: "Winter Collection",
        path: "/products",
        children: [
          {
            text: "Men's Wear",
            path: "/products",
          },
          {
            text: "Women's Wear",
            path: "/products",
          },
          {
            text: "Kids' Wear",
            path: "/products",
          },
        ]
      },
      {
        text: "Summer Collection",
        path: "/products",
        children: [
          {
            text: "Men's Shirts",
            path: "/products",
          },
          {
            text: "Men's Shades",
            path: "/products",
          },
          {
            text: "Kids' Trousers",
            path: "/products",
          },
        ]
      },
      {
        text: "Men's Collection",
        path: "/products",
        children: [
          {
            text: "Apparel",
            path: "/products",
          },
          {
            text: "Accessories",
            path: "/products",
          },
          {
            text: "Pajamas",
            path: "/products",
          },
          {
            text: "Sweatshirts",
            path: "/products",
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
  // const { token, currentUser, resetAuth } = useAuth()
  
  const [showSearchbar, setShowSearchbar] = useState<boolean>(false)
  const [showCart, setShowCart] = useState<boolean>(false)

  return ( 
    <div className='bg-black relative text-white w-screen'>
      {/* SEARCH BAR COMPONENT */}
      <LightBackground {...{setShow: (v)=> setShowSearchbar(v), show: showSearchbar}} />
      <SearchBar {...{showSearchbar, setShowSearchbar: (v)=> setShowSearchbar(v)}} />

      {/* CART COMPONENT */}
      <DarkBackground {... {setShow: (v)=> setShowCart(v), show: showCart}} />
      <Cart {...{setShow: (v)=> setShowCart(v), show: showCart}}/>

      <div className='flex justify-between items-center w-[90%] m-auto py-6'>
        <Link to='/'><h1 className='text-4xl font-[Comfortaa] font-extrabold select-none hover:text-[#418791] duration-300'>Valeria</h1></Link>
        <ul className='flex gap-12 text-md justify-center items-center'>
          {links.map((link, i)=>
            <div key={i} className='group-hover:text-[#418791] duration-150 relative group/primary select-none z-[9] cursor-pointer'>
              <Link className='inline-block py-3' to={link.path}>{link.name}</Link>
              {link.children&&
              <div className='absolute group-hover/primary:opacity-100 group-hover/primary:top-[100%] group-hover/primary:scale-y-100 origin-top scale-y-95 pointer-events-none group-hover/primary:pointer-events-auto opacity-0 top-[80%] bg-white text-black shadow-lg text-sm duration-400'>
                {link.children.map((child, x)=> 
                  <div key={x} className='relative not-first:border-t border-gray-400 text-nowrap group/secondary'>
                    <Link className='p-4 gap-3 flex justify-between items-center' to={child.path}>
                      {child.text}
                      <FaArrowRight className='text-xs'/>
                    </Link>
                  {child.children&&
                    <div className='absolute left-[90%] top-0 shadow-lg opacity-0 group-hover/secondary:opacity-100 group-hover/secondary:left-[100%]  pointer-events-none group-hover/secondary:pointer-events-auto bg-white text-black text-sm duration-400 '>
                      {child.children.map((grandchild, y)=>
                        <Link key={y} to={grandchild.path} className='flex relative justify-between items-center p-4 not-first:border-t gap-3 border-gray-400 text-nowrap'>
                          {grandchild.text}
                        </Link>
                      )}
                    </div>
                  }
                  </div>
                )}
              </div>
              }
            </div>
          )}
        </ul>
        <div className='flex items-center gap-6 text-[28px]'>
          <MdOutlineSearch onClick={()=>setShowSearchbar(true)} className='cursor-pointer hover:scale-[1.15] duration-200'/>
          <Link to='/'><MdOutlineFavoriteBorder className=' hover:scale-[1.15] duration-200'/></Link>
          <Link to='/'><RiAccountCircleLine className='hover:scale-[1.15] duration-200'/></Link>
          <div onClick={()=> setShowCart(true)} className='cursor-pointer group relative'>
            <MdOutlineShoppingBag className='group-hover:scale-[1.15] duration-200 '/>
            <span className='absolute -top-1 -left-2 text-[12px] bg-[#ffd041] text-gray-700 font-bold rounded-full w-4.5 h-4.5 flex justify-center items-center'>0</span>
          </div>
          <RiMenuFill className='cursor-pointer hover:scale-[1.15] duration-75'/>
        </div>
      </div>
    </div>
  )
}

export default Navbar