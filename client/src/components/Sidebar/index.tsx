import React, { useRef, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
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

const customerLinks = [
{title: '',
  links: [
    {
      name: "Profile",
      path: "/profile",
      icon: <MdPerson2 />,
    },
    {
      name: "Orders",
      path: "/my-orders",
      keywords: ['orders', 'my-orders'],
      icon: <FiInbox />,
    },
    {
      name: "Shipping Addresses",
      path: "/shipping-addresses",
      icon: <FiUsers />,
    },
    {
      name: "Payment Methods",
      path: "/payment-methods",
      icon: <RiToolsFill/>
    },
    {
      name: "Support",
      path: "/support",
      icon: <RiFeedbackFill/>
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
      },
      {
        name: "Products",
        path: "/dashboard/products",
        keywords: ['/dashboard/product'],
        icon: <AiOutlineProduct />,
      },
      {
        name: "Orders",
        path: "/dashboard/orders",
        keywords: ['/dashboard/orders'],
        icon: <FiPackage />,
      },
      {
        name: "Finances",
        path: "/dashboard/finances",
        icon: <RiBankLine/>
      },
      {
        name: "Customers",
        path: "/dashboard/customers",
        icon: <IoPeopleOutline />,
      }
    ]
  },
  {
    title: 'Manage Content',
    links: [
      {
        name: "Content",
        path: "/dashboard/content",
        icon: <FiType/>
      },
      {
        name: "Analytics",
        path: "/dashboard/analytics",
        icon: <IoAnalyticsOutline/>
      },
      {
        name: "Marketing",
        path: "/dashboard/marketing",
        icon: <IoMegaphoneOutline/>
      },
      {
        name: "Discounts",
        path: "/dashboard/discounts",
        icon: <TbDiscount/>
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
        className={`hidden md:flex flex-col sticky ${withNav? 'h-[calc(100vh-98px)] top-24':' top-0 h-screen'} left-0 pb-6 bg-white text-primary-text z-99 border-r border-gray-200 shadow-sm hover:shadow-md transition-all`}
      >
      <Link to='/' className='flex items-center gap-2 py-8 px-4 border-[#d9d9d9] border-b'>
        <div className='w-10 aspect-square'>
          <img src={'/logo.png'} alt='Valeria logo'/>

        </div>
        <p className='text-2xl font-[Elms_Sans]'>Valeria</p>
      </Link>
      {/* Navigation Links */}
      <div className='flex-col text-md justify-center pt-5 flow-root root gap-6 space-y-3 grow overflow-y-auto'>
        {getLinks(user).map((set, x) => (
        <div key={x} className='space-y-2.5 px-5'>
          {set.title&&<h3 className='text-[#1f1f1f] text-sm font-bold px-2 font-[Sans]'>{set.title}</h3>}
          <ul className='flex flex-col text-md justify-center gap-1'>
            {set.links.map((link,i)=>
              <Link 
                to={link.path}
                key={i}
                className={`
                  relative select-none z-9 cursor-pointer py-3.5
                  pr-20
                  pl-4
                  rounded-lg
                  flex items-center gap-3.5 duration-150 text-sm 
                  ${
                    ((link.path === (location.pathname.endsWith('/') ? 
                      location.pathname.slice(0, -1) : 
                      location.pathname))
                      ||
                      link.keywords?.find(k=>location.pathname.includes(k))
                    )? 'bg-primary-50/70 text-primary-600' : 'hover:bg-gray-50'}
                `}
              >
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
        <div className='flex items-center gap-2 p-4 border-y border-[#d3d3d3]'>
          <div className='w-10 rounded-full overflow-hidden border border-[#d3d3d3] aspect-square'>
            <img src={user?.avatarUrl||'/'} onError={(e)=> {
              e.currentTarget.onerror=null; e.currentTarget.src='/imgs/avatar.webp'
            }} className='w-full h-full object-cover object-top' alt='User Avatar'/>
          </div>
          <p className='text-sm font-[Comfortaa]'>{user?.firstname} {user?.lastname}</p>
        </div>
      </div>
      </div>

      {/* Mobile dashboard drawer, toggled via event */}
      {showMobile && (
        <>
          <div onClick={()=>setShowMobile(false)} className='fixed inset-0 bg-black/40 z-50' />
          <div className='fixed left-0 top-0 bottom-0 w-72 bg-white z-60 p-4 overflow-y-auto border-r border-gray-200 shadow-md'>
            <div className='flex items-center gap-2 py-4 border-b mb-4'>
              <div className='w-10 aspect-square'>
                <img src={'/logo.png'} alt='Valeria logo'/>
              </div>
              <p className='text-2xl font-[Elms_Sans]'>Valeria</p>
              <button onClick={()=>setShowMobile(false)} className='ml-auto text-xl'>×</button>
            </div>
            <div className='flex-col text-md justify-center pt-2 flow-root root gap-6 space-y-3'>
              {getLinks(user).map((set, x) => (
                <div key={x} className='space-y-2.5 px-2'>
                  {set.title&&<h3 className='text-[#1f1f1f] text-sm font-bold px-2 font-[Sans]'>{set.title}</h3>}
                  <ul className='flex flex-col text-md justify-center gap-1'>
                    {set.links.map((link,i)=>
                      <Link 
                        to={link.path}
                        key={i}
                        onClick={()=>setShowMobile(false)}
                        className={`relative select-none z-9 cursor-pointer py-3.5 pr-20 pl-4 rounded-lg flex items-center gap-3.5 duration-150 text-sm hover:bg-gray-50`}
                      >
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
      )}
    </>
  )
}

export default Sidebar