import React, { useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  RiFeedbackFill, 
  RiHome6Line, 
  RiToolsFill
} from "react-icons/ri";
import { CiDiscount1, CiEdit } from "react-icons/ci";
import { MdOutlineAnalytics, MdPerson2 } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
// import {Avatar} from '../ui/Avatar';
import { FiInbox, FiPackage, FiUsers } from 'react-icons/fi';
import { UserType } from '../../types';
import { IoPeopleOutline } from 'react-icons/io5';
import { PiBankLight, PiMegaphoneLight } from 'react-icons/pi';
import { AiOutlineProduct } from 'react-icons/ai';

const customerLinks = [
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

const adminLinks = [
    {
        name: "Home",
        path: "/dashboard/",
        icon: <RiHome6Line />,
    },
    {
      name: "Products",
      path: "/dashboard/products",
      keywords: ['products'],
      icon: <AiOutlineProduct />,
    },
    {
      name: "Orders",
      path: "/dashboard/orders",
      keywords: ['orders', 'my-orders'],
      icon: <FiPackage />,
    },
    {
      name: "Customers",
      path: "/dashboard/shipping-addresses",
      icon: <IoPeopleOutline />,
    },
    {
      name: "Content",
      path: "/dashboard/payment-methods",
      icon: <CiEdit/>
    },
    {
      name: "Finances",
      path: "/dashboard/support",
      icon: <PiBankLight/>
    },
    {
      name: "Analytics",
      path: "/dashboard/support",
      icon: <MdOutlineAnalytics/>
    },
    {
      name: "Marketing",
      path: "/dashboard/support",
      icon: <PiMegaphoneLight/>
    },
    {
      name: "Discounts",
      path: "/dashboard/support",
      icon: <CiDiscount1/>
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

  return (
    <div 
      ref={sidebarRef}
      className={`flex flex-col sticky ${withNav? 'h-[calc(100vh-98px)] top-24':' top-0 h-screen'} left-0 pb-6 bg-[#f3f3f3] text-primary-text z-99 border-r border-gray-200 shadow-sm hover:shadow-md transition-all`}
    >
      {/* Navigation Links */}
      <ul className='flex flex-col text-md justify-center p-3 mt-4 gap-1'>
        {getLinks(user).map((link, i) => (
          <li
            key={i}
            className={`
              relative select-none z-9 cursor-pointer py-2
              pr-16
              rounded-lg
              group/secondary 
              ${link.keywords?.some(keyword => location.pathname.includes(keyword)) || location.pathname === link.path ? 'bg-white text-primary-600' : 'hover:bg-gray-50'}
            `}
          >
            <Link 
              className='flex items-center gap-2.5 duration-150 text-sm overflow-hidden p-2' 
              to={link.path}
            >
              <div className={`
                flex items-center justify-center shrink-0
                text-2xl duration-100 mx-1 rounded-lg
              `}>
                {link.icon}
              </div>
              <p className='text-gray-700 font-medium text-nowrap'>{link.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar