import React, { useState } from 'react'
import Hero from '../../assets/imgs/landing/hero.jpg';
import EidOffer from '../../assets/imgs/landing/EID60mainEN.webp'
import FatherOffer from '../../assets/imgs/landing/FatherDisEN2.png'
import valuBanner from '../../assets/imgs/landing/BannerValu.png'
import icon1 from '../../assets/imgs/landing/icon-1.png'
import icon2 from '../../assets/imgs/landing/icon-2.png'
import icon3 from '../../assets/imgs/landing/icon-3.png'

import { Link } from 'react-router';
import { FaCcMastercard, FaCcVisa, FaFacebookF, FaInstagram, FaTiktok, FaYoutube} from 'react-icons/fa';


const paymentMethods = [
  {src: icon1},
  {src: icon2},
  {src: icon3},
]

const footerLinks = [
  {
    head: "Customer Service",
    links: [
      {
        text: "VALERIA Terms And Condition",
        path: "/"
      },
      {
        text: "VALERIA Privacy Policy",
        path: "/"
      },
      {
        text: "Delivery And Returns",
        path: "/"
      },
      {
        text: "Terms of Service",
        path: "/"
      },
      {
        text: "Refund policy",
        path: "/"
      },
    ]
  },
  {
    head: "ABOUT",
    links: [
      {
        text: "About VALERIA",
        path: "/"
      },
      {
        text: "How To Purchase",
        path: "/"
      }
    ]
  },
  {
    head: "CONTACT US",
    links: [
      {
        text: "Contact Us",
        path: "/"
      }
    ]
  },

]


const Home: React.FC = ()=>{
  return (
    <div className=''>
      <div className='h-screen flex justify-center items-center overflow-y-hidden relative bg-[#4d4d26]'>
        <img className='absolute top-0 w-full object-fill opacity-[.4]' loading='lazy' src={Hero}/>
        <div className="z-[2] w-[67%] text-white">
          <h1 className='text-8xl font-[abominable]'>Elegance</h1>
          <h1 className='text-8xl font-[abominable]'>Charisma</h1>
          <h1 className='text-8xl font-[abominable]'>Simplicity</h1>
          <p className='mt-4 text-md text-wrap'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi praesentium quia delectus mollitia at quibusdam assumenda maiores quae, est.</p>
          <Link to='/' className='bg-[#eab308] text-lg text-[#fff] font-bold inline-block py-4 px-5 rounded mt-4 duration-150 hover:bg-[#ca8a04]'>
            Start Shopping
          </Link>
        </div>
      </div>
      <div>
        <Link className='block border border-slate-50 w-full m-0' to='/'>
          <img className='w-full' loading='lazy' src={EidOffer} alt="" />
        </Link>
        <Link className='block border border-slate-50' to='/'>
          <img className='w-full' loading='lazy' src={valuBanner} alt="" />
        </Link>
        <Link className='block border border-slate-50' to='/'>
          <img className='w-full' loading='lazy' src={FatherOffer} alt="" />
        </Link>
      </div>
      {/* <div className='mt-16 mb-6 w-[67%] mx-auto'>
        <h1 className='text-center font-semibold text-4xl'>PVC Marble Sheet</h1>
        <p className='mt-4 w-3/4 mx-auto'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi praesentium quia delectus mollitia at quibusdam assumenda maiores quae.</p>
        <div className='flex w-full justify-between gap-8 mt-4'>
          {cards.map((card)=>
            <div className='flex-1 flex flex-col select-none items-center text-center rounded py-8 px-4 shadow-md duration-300 hover:shadow-2xl'>
              <h1 className='text-xl'>{card.header}</h1>
              <img className='w-1/3 mt-6' src={card.img} alt="test" />
              <p className='text-sm mt-6'>{card.body}</p>
            </div>
          )}
        </div>
      </div> */}
      <div className='bg-black text-white'>
        <div className='text-center py-16'>
          <h1 className='uppercase font-[abominable] text-4xl mb-1'>Sign Up for Valeria's Newsletter</h1>
          <p className='text-slate-100 text-sm mb-4'>be the first to know about our newest arrivals, special offers and store events near you.</p>
          <form className='flex gap-2 w-[600px] mx-auto'>
            <input  className='bg-white grow px-4 text-black' placeholder='Type Your Email Address' type="email" />
            <button className='bg-[#eab308] text-black py-2 px-6 duration-150 hover:bg-[#ca8a04] cursor-pointer'>
              Submit
            </button>
          </form>
        </div>
        <div className='grid grid-cols-4 gap-10 border-t border-gray-500 py-16 w-[90%] mx-auto'>
          {footerLinks.map(sec=>
            <div>
              <h1 className='mb-6 text-sm'>{sec.head}</h1>
              <div className='flex flex-col gap-4 text-gray-400 text-sm'>
                {sec.links.map(link=>
                  <Link className='block hover:underline hover:text-white duration-300' to={link.path}>{link.text}</Link>
                )}
              </div>
            </div>
          )}
          <div className='grid grid-rows-2'>
            <div>
              <h1 className='mb-6 text-sm'>Keep In Touch</h1>
              <div className='flex gap-4 text-xl'>
                <Link to='/' className='relative group rounded-full p-2 hover:bg-white hover:scale-[1.15] border-t duration-300'>
                  <FaFacebookF className='group-hover:text-black duration-300'/>
                </Link>
                <Link to='/' className='relative group rounded-full p-2 hover:bg-white hover:scale-[1.15] border-t duration-300'>
                  <FaInstagram className='group-hover:text-black duration-300'/>
                </Link>
                <Link to='/' className='relative group rounded-full p-2 hover:bg-white hover:scale-[1.15] border-t duration-300'>
                  <FaTiktok className='group-hover:text-black duration-300'/>
                </Link>
                <Link to='/' className='relative group rounded-full p-2 hover:bg-white hover:scale-[1.15] border-t duration-300'>
                  <FaYoutube className='group-hover:text-black duration-300'/>
                </Link>
              </div>
            </div>
            <div>
              <h1 className='mb-6 text-sm'>Payment Accept</h1>
              <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
                <FaCcVisa size={40}/>
                <FaCcMastercard size={40}/>
                {paymentMethods.map(method=>
                  <img className='w-20 h-full' src={method.src} alt="none" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='bg-white text-slate-800 text-center py-6'>
        © Valeria 2025
      </div>
    </div>
  )
}

export default Home