import { LuShoppingBag } from "react-icons/lu";

import { Link } from 'react-router'

const HeroSection = () => {
  return (
    <section className='h-screen relative text-[#ffffff] md:text-[#1e1e1e] font-[Comfortaa] overflow-hidden'>
      <picture>
        <source media="(max-width: 767px)" srcSet="/imgs/landing/hero-min.webp"/>
        <img src="/imgs/landing/hero.webp" className="h-full w-full object-center absolute top-0 left-0 object-cover -z-1"/>
      </picture>
      <div className="w-full h-full z-11 bg-linear-to-br from-[#b97900]/70 to-[#a8b400]/60 md:bg-none space-y-8 p-10 md:px-20 py-10 xl:px-30 flex flex-col sm:items-start justify-center absolute top-0 left-0">
        <div className='md:text-7xl leading-tight min-[400px]:text-6xl text-5xl 2xl:text-8xl font-medium font-[Titan_One]'>
          <h1>Elegance</h1>
          <h1>Redefined</h1>
          <h1>Style</h1>
        </div>
        <p className='text-xl text-wrap md:w-1/2'>Discover curated fashion and lifestyle products that reflect your unique personality.</p>
        <Link to='/shop' className='p-3.5 px-6 pr-8 flex group items-center hover:bg-transparent cursor-pointer font-bold text-lg text-white bg-[#0a0a07] sm:bg-[#1e1e1e] ltr duration-300 text-nowrap justify-center gap-3 border sm:border-[#1e1e1e] border-white sm:hover:text-[#1e1e1e] self-start rounded-4xl'>
          <span className='duration-300 rounded-full text-2xl'><LuShoppingBag/></span>
          Start Shopping
        </Link>
      </div>
    </section>
  )
}

export default HeroSection