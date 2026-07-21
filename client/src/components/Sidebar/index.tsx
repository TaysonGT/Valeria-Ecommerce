import React, { useRef, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import {
  RiBankLine,
  RiFeedbackFill,
  RiSpeedUpLine, 
  RiToolsFill
} from "react-icons/ri";
import { MdPerson2 } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { FiInbox, FiPackage, FiType, FiUsers } from 'react-icons/fi';
import { UserType } from '../../types';
import { IoAnalyticsOutline, IoMegaphoneOutline, IoPeopleOutline } from 'react-icons/io5';
import { AiOutlineProduct } from 'react-icons/ai';
import { TbDiscount } from 'react-icons/tb';
import DarkBackground from '../DarkBackground';
import { HiLockClosed } from 'react-icons/hi';

const customerLinks = [
{
  title: '',
  links: [
    {
      name: "Profile",
      path: "/profile",
      icon: <MdPerson2 />,
      active: true
    },
    {
      name: "Orders",
      path: "/my-orders",
      keywords: ['orders', 'my-orders'],
      icon: <FiInbox />,
      active: true
    },
    {
      name: "Shipping Addresses",
      path: "/shipping-addresses",
      icon: <FiUsers />,
      active: true
    },
    {
      name: "Payment Methods",
      path: "/payment-methods",
      icon: <RiToolsFill/>,
      active: true
    },
    {
      name: "Support",
      path: "/support",
      icon: <RiFeedbackFill/>,
      active: true
    }
  ]
}]

const adminLinks = [
  {
    title: 'Control Panel',
    links: [
      {
        name: "Overview",
        path: "/dashboard",
        icon: <RiSpeedUpLine />,
        active: true
      },
      {
        name: "Products",
        path: "/dashboard/products",
        keywords: ['/dashboard/product'],
        active: true,
        icon: <AiOutlineProduct />,
      },
      {
        name: "Orders",
        path: "/dashboard/orders",
        keywords: ['/dashboard/orders'],
        active: true,
        icon: <FiPackage />,
      },
      {
        name: "Finances",
        path: "/dashboard/finances",
        icon: <RiBankLine/>,
        active: false
      },
      {
        name: "Customers",
        path: "/dashboard/customers",
        icon: <IoPeopleOutline />,
        active: false
      }
    ]
  },
  {
    title: 'Manage Content',
    links: [
      {
        name: "Content",
        path: "/dashboard/content",
        icon: <FiType/>,
        active: false
      },
      {
        name: "Analytics",
        path: "/dashboard/analytics",
        icon: <IoAnalyticsOutline/>,
        active: false
      },
      {
        name: "Marketing",
        path: "/dashboard/marketing",
        icon: <IoMegaphoneOutline/>,
        active: false
      },
      {
        name: "Discounts",
        path: "/dashboard/discounts",
        icon: <TbDiscount/>,
        active: false
      }
    ]
  } 
]

const getLinks = (user?:UserType|null)=>{
  return user?.role==='customer'?
  customerLinks
  :adminLinks
}

const Sidebar: React.FC<{withNav: boolean}> = ({withNav=false}) => {
  const location = useLocation();
  const { user } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [showMobile, setShowMobile] = useState<boolean>(false);

  useEffect(()=>{
    const handler = ()=> setShowMobile(s=>!s)
    window.addEventListener('toggle-dashboard-sidebar', handler)
    return ()=> window.removeEventListener('toggle-dashboard-sidebar', handler)
  },[])

  return (
    <>
      {/* Desktop / tablet sidebar (unchanged) */}
      <div 
        ref={sidebarRef}
        className={`hidden lg:flex flex-col sticky ${withNav? 'h-[calc(100vh-98px)] top-24':' top-0 h-screen'} text-[#3f3f3f] left-0 pb-6 bg-[#fff] z-99 border-r border-[#d9d9d9] shadow-sm hover:shadow-md transition-all`}
      >
      <Link to='/' className='flex items-center gap-4 py-6 px-4 border-[#d9d9d9] border-b'>
        <div className='w-10 aspect-square'>
          <img src={'/logo.png'} alt='Valeria logo'/>

        </div>
        <p className='text-2xl font-[Elms_Sans]'>Valeria</p>
      </Link>
      {/* Navigation Links */}
      <div className='flex-col text-md justify-center px-4 flow-root rootspace-y-3 grow overflow-y-auto font-[Outfit]'>
        {getLinks(user).map((set, x) => (
          <div key={x} className='space-y-2.5 py-4 not-last:border-b border-[#d9d9d9]'>
          {/* {set.title&&<h3 className='text-[#1f1f1f] text-sm font-bold px-2 font-[Sans]'>{set.title}</h3>} */}
          <ul className='flex flex-col text-md justify-center gap-1'>
            {set.links.map((link,i)=>
              <Link 
                to={link.path}
                key={i}
                className={`
                  relative select-none z-9 cursor-pointer py-3.5
                  pr-20
                  pl-4
                  border
                  rounded-lg
                  flex items-center gap-3.5 duration-150 text-sm 
                  overflow-hidden
                  ${ link.active?
                    ((link.path === (location.pathname.endsWith('/') ? 
                      location.pathname.slice(0, -1) : 
                      location.pathname))
                      ||
                      link.keywords?.find(k=>location.pathname.includes(k))
                    )? 'bg-primary-500 text-primary-50 border-none ' : 'border-transparent bg-white hover:bg-primary-100/90 hover:text-primary-950'
                    :
                    'border-[#acacac] pointer-events-none'
                  }
                `}
              >
                {!link.active&&
                  <div className='flex items-center gap-2 font-medium justify-center absolute top-0 left-0 h-full w-full bg-black/10 text-sm text-white'>
                    <div className='flex items-center justify-center bg-black/70 gap-1 p-1.5 rounded-lg px-2 pr-3'>
                      <HiLockClosed className=' text-xl'/>
                      Coming soon
                    </div>
                  </div>
                }
                  <div className={`
                    flex items-center justify-center shrink-0
                    text-2xl duration-100 rounded-lg
                  `}>
                    {link.icon}
                  </div>
                  <p className=' font-medium text-nowrap'>{link.name}</p>
              </Link>
            )}
          </ul>
        </div>
        ))}
      </div>
        <div className='flex items-center gap-2 p-4 bg-[#f7f7f7] border-y border-[#d9d9d9]'>
          <div className='w-10 rounded-full overflow-hidden border border-[#ebebeb] aspect-square'>
            <img src={user?.avatarUrl||'/'} onError={(e)=> {
              e.currentTarget.onerror=null; e.currentTarget.src='/imgs/avatar.webp'
            }} className='w-full h-full object-cover object-top' alt='User Avatar'/>
          </div>
          <p className='text-sm font-[Comfortaa]'>{user?.firstname} {user?.lastname}</p>
        </div>
      </div>

      {/* Mobile dashboard drawer, toggled via event */}
      <DarkBackground show={showMobile} hide={()=>setShowMobile(false)} direction='left'/>
      <div className={`block lg:hidden fixed left-0 top-0 bottom-0 ${showMobile? 'translate-x-0':'-translate-x-full'} bg-[#fff] text-[#3f3f3f] z-120 p-4 duration-300 overflow-y-auto border-r border-[#d3d3d3] shadow-md `}>
        <Link to='/' className='flex items-center gap-4 py-4 border-b border-[#d9d9d9]'>
          <div className='w-10 aspect-square'>
            <img src={'/logo.png'} alt='Valeria logo'/>
          </div>
          <p className='text-2xl font-[Elms_Sans]'>Valeria</p>
          {/* <button onClick={()=>setShowMobile(false)} className='ml-auto text-xl'>×</button> */}
        </Link>
        <div className='flex-col text-md justify-center flow-root root'>
          {getLinks(user).map((set, x) => (
          <div key={x} className='space-y-2.5 py-4 not-last:border-b border-[#d9d9d9]'>
              {/* {set.title&&<h3 className='text-[#1f1f1f] text-sm font-bold px-2 font-[Sans]'>{set.title}</h3>} */}
              <ul className='flex flex-col text-md justify-center gap-1'>
                {set.links.map((link,i)=>
                  <Link 
                    to={link.path}
                    key={i}
                    onClick={()=>setShowMobile(false)}
                    className={`relative select-none z-9 cursor-pointer py-3.5 pr-20 pl-4 border
                      ${link.active?
                        ((
                        link.path === (location.pathname.endsWith('/') ? 
                        location.pathname.slice(0, -1) : 
                        location.pathname))
                        ||
                        link.keywords?.find(k=>location.pathname.includes(k))
                        )? 
                        'bg-primary-500 text-primary-50 border-none ' : 'border-transparent bg-white hover:bg-primary-100/90 hover:text-primary-950'
                        :
                        'border-[#acacac] pointer-events-none'
                      }
                    rounded-lg overflow-hidden flex items-center gap-3.5 duration-150 text-sm hover:bg-gray-50`}
                  >
                    {!link.active&&
                      <div className='flex items-center gap-2 font-medium justify-center absolute top-0 left-0 h-full w-full bg-black/10 text-sm text-white'>
                        <div className='flex items-center justify-center bg-black/70 gap-1 p-1.5 rounded-lg px-2 pr-3'>
                          <HiLockClosed className=' text-xl'/>
                          Coming soon
                        </div>
                      </div>
                    }
                      <div className={`flex items-center justify-center shrink-0 text-2xl duration-100 rounded-lg`}>{link.icon}</div>
                      <p className=' font-medium text-nowrap'>{link.name}</p>
                  </Link>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Sidebar