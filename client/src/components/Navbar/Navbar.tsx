import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RiAccountCircleLine, RiLogoutCircleRLine, RiMenuFill } from "react-icons/ri";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { PiPackage } from "react-icons/pi";
import { MdOutlineShoppingBag, MdOutlineFavoriteBorder, MdOutlineSearch, MdArrowRight } from "react-icons/md";
import { FaRegUserCircle } from 'react-icons/fa';
import SearchBar from '../SearchBar';
import LightBackground from '../LightBackground';
import DarkBackground from '../DarkBackground';
import Cart from '../Cart';
import { useCart } from '../../context/CartContext';
import { Dropdown } from '../Dropdown';
import { useAuth } from '../../context/AuthContext';

 const links = [
  {
    name: "Home",
    path: "/"
  },
  {
    name: "Collections",
    path: "/shop",
    children: [
      {
        text: "Winter Collection",
        path: "/shop",
        children: [
          {
            text: "Men's Wear",
            path: "/shop",
          },
          {
            text: "Women's Wear",
            path: "/shop",
          },
          {
            text: "Kids' Wear",
            path: "/shop",
          },
        ]
      },
      {
        text: "Summer Collection",
        path: "/shop",
        children: [
          {
            text: "Men's Shirts",
            path: "/shop",
          },
          {
            text: "Men's Shades",
            path: "/shop",
          },
          {
            text: "Kids' Trousers",
            path: "/shop",
          },
        ]
      },
      {
        text: "Men's Collection",
        path: "/shop",
        children: [
          {
            text: "Apparel",
            path: "/shop",
          },
          {
            text: "Accessories",
            path: "/shop",
          },
          {
            text: "Pajamas",
            path: "/shop",
          },
          {
            text: "Sweatshirts",
            path: "/shop",
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
  const [showSearchbar, setShowSearchbar] = useState<boolean>(false)
  const [showCart, setShowCart] = useState<boolean>(false)
  
  const {cartItems} = useCart()
  const {user, logout} = useAuth()
  
  const nav = useNavigate()
  
  const dropDownItems = [
    {
      label: "Profile",
      value: "profile",
      icon: <FaRegUserCircle className='text-lg'/>,
      onClick: () => nav(`/profile/${user?._id}`)
    },
    {
      label: "My Orders",
      value: "orders",
      icon: <PiPackage className='text-lg'/>,
      onClick: () => nav(`/my-orders`)
    },
    {
      label: "Support",
      value: "support",
      icon: <TfiHeadphoneAlt className='text-lg'/>,
      onClick: () => nav('/support')
    },
    {
      label: "Logout",
      value: "logout",
      color: 'red-500',
      icon: <RiLogoutCircleRLine className='text-lg'/>,
      onClick: async () => {
        await logout();
        nav('/');
      }
    }
  ]

  return ( 
    <div className='bg-black fixed text-white w-full z-105 font-[Comfortaa]'>
      {/* SEARCH BAR COMPONENT */}
      <LightBackground {...{setShow: (v)=> setShowSearchbar(v), show: showSearchbar}} />
      <SearchBar {...{showSearchbar, setShowSearchbar: (v)=> setShowSearchbar(v)}} />

      {/* CART COMPONENT */}
      <DarkBackground {... {hide: ()=> setShowCart(false), show: showCart}} />
      <Cart {...{setShow: (v:boolean)=> setShowCart(v), show: showCart}}/>

      <div className='flex justify-between items-center gap-16 xl:gap-0 w-full xl:m-auto sm:px-20 px-10 xl:px-30 py-6'>
        <div className='flex-1 flex justify-start items-stretch'>
          <Link to='/'><h1 className='text-4xl font-[Comfortaa] font-extrabold select-none hover:text-[#e0fbff] duration-300'>Valeria</h1></Link>
        </div>
        <ul className='flex-1 lg:flex hidden gap-12 text-md justify-center items-center'>
          {links.map((link, i)=>
            <div key={i} className='group-hover:text-[#418791] duration-150 relative group/primary select-none z-9 cursor-pointer'>
              <Link className='inline-block py-3' to={link.path}>{link.name}</Link>
              {link.children&&
              <div className='absolute group-hover/primary:opacity-100 group-hover/primary:top-full group-hover/primary:scale-y-100 origin-top scale-y-95 pointer-events-none group-hover/primary:pointer-events-auto opacity-0 top-[80%] bg-white text-black shadow-lg text-sm duration-400 rounded-sm p-2'>
                {link.children.map((child, x)=> 
                  <div key={x} className='relative text-nowrap group/secondary'>
                    <Link className='p-3 pl-0  pr-6 gap-1 flex items-center hover:bg-[#f3f3f3] rounded-md' to={child.path}>
                      <MdArrowRight className='text-xl'/>
                      {child.text}
                    </Link>
                  {child.children&&
                    <div className='absolute left-[90%] top-0 shadow-lg opacity-0 group-hover/secondary:opacity-100 group-hover/secondary:left-full  pointer-events-none group-hover/secondary:pointer-events-auto bg-white text-black text-sm duration-400 rounded-md p-2'>
                      {child.children.map((grandchild, y)=>
                        <Link key={y} to={grandchild.path} className='flex relative justify-between items-center p-3 pr-6 gap-1 text-nowrap hover:bg-[#f3f3f3] rounded-md'>
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
        <div className='flex-1 flex items-center sm:gap-6 gap-4 text-[28px] justify-end'>
          <MdOutlineSearch onClick={()=>setShowSearchbar(true)} className='cursor-pointer hover:scale-[1.15] duration-200'/>
          <Link to='/'>
            <MdOutlineFavoriteBorder className=' hover:scale-[1.15] duration-200'/>
          </Link>
          {user&&<Dropdown trigger={
            <RiAccountCircleLine className='hover:scale-[1.15] duration-200'/>
            }
            items={dropDownItems}/>
          }
          <button onClick={()=> setShowCart(true)} className='cursor-pointer group relative'>
            <MdOutlineShoppingBag className='group-hover:scale-[1.15] duration-200 '/>
            <span className='absolute -top-1 -left-2 text-[12px] bg-[#ffd041] text-gray-700 font-bold rounded-full w-4.5 h-4.5 flex justify-center items-center'>{cartItems.length}</span>
          </button>
          <RiMenuFill className='cursor-pointer md:hidden hover:scale-[1.15] duration-75'/>
          {!user&&
            <Link className='px-3 py-2 bg-white text-black border border-white hover:bg-white/95 duration-150 rounded-sm text-sm ml-2' to='/auth/login'>
              Login
            </Link>
          }
        </div>
      </div>
    </div>
  )
}

export default Navbar