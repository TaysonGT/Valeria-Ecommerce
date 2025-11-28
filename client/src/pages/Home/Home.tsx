import React from 'react'
import icon1 from '../../assets/imgs/landing/icon-1.png'
import icon2 from '../../assets/imgs/landing/icon-2.png'
import icon3 from '../../assets/imgs/landing/icon-3.png'
import { Link } from 'react-router';
import { FaCcMastercard, FaCcVisa, FaFacebookF, FaInstagram, FaTiktok, FaYoutube} from 'react-icons/fa';
import FeaturedSection from './sections/FeaturedSection';
import HeroSection from './sections/HeroSection';
import ServicesSection from './sections/ServicesSection';


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


const HomePage: React.FC = ()=>{
  return (
    <div>
      <HeroSection/>
      <div className='w-full py-6 bg-[#98eee0]'>
        <div className='flex justify-between items-center max-w-7xl w-full mx-auto'>
          {[...Array(4)].map((i)=>
            <div key={i}>
              <p className='uppercase text-lg font-bold'>Work hard for it</p>
              <span className='not-last:block hidden h-1 aspect-square rounded-full bg-[#737373]'/>
            </div>
          )}
        </div>
      </div>
      <FeaturedSection/>
      <ServicesSection/>
      <section className='bg-black text-white'>
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
        <div className='grid grid-cols-4 gap-10 border-t border-gray-500 py-16 w-[85%] mx-auto'>
          {footerLinks.map((sec, i)=>
            <div key={i}>
              <h1 className='mb-6 text-sm'>{sec.head}</h1>
              <div className='flex flex-col gap-4 text-gray-400 text-sm'>
                {sec.links.map((link, x)=>
                  <Link key={x} className='block hover:underline hover:text-white duration-300' to={link.path}>{link.text}</Link>
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
                {paymentMethods.map((method, y)=>
                  <img key={y} className='w-20 h-full' src={method.src} alt="none" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className='bg-white text-slate-800 text-center py-6'>
        © Valeria 2025
      </div>
    </div>
  )
}

export default HomePage