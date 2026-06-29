import { LuShoppingBag } from "react-icons/lu";

import { Link } from 'react-router'

const HeroSection = () => {
  return (
    <section className='relative text-[#ffffff] md:text-[#1e1e1e] font-[Comfortaa] overflow-hidden h-[calc(100vh-54px)] md:h-[calc(100vh-88px)]'>
      <picture>
        <source media="(max-width: 767px)" srcSet="/imgs/landing/hero-min.webp"/>
        <img src="/imgs/landing/hero.webp" className="h-full w-full object-center absolute top-0 left-0 object-cover -z-1"/>
      </picture>
      <div className="w-full h-full z-11 bg-linear-to-br txt-ce from-[#98830e]/80 to-[#383c00]/90 md:bg-none space-y-8 p-10 md:px-16 py-10 xl:px-30 flex flex-col sm:items-start justify-center absolute top-0 left-0">
        <div className=' leading-snug text-5xl min-[400px]:text-5xl xl:text-7xl font-light font-[Titan_One]'>
          <h1>Elegance</h1>
          <h1>Redefined</h1>
          <h1>Style</h1>
        </div>
        <p className='leading-relaxed text-xl md:text-2xl text-wrap md:w-1/2'>Discover curated fashion and lifestyle products that reflect your unique personality.</p>
        <Link to='/shop' className='p-3.5 px-6 pr-8 flex group items-center hover:bg-transparent cursor-pointer font-bold text-base md:text-lg text-white bg-[#0a0a07] sm:bg-[#1e1e1e] ltr duration-300 text-nowrap justify-center gap-3 border sm:border-[#1e1e1e] border-white sm:hover:text-[#1e1e1e] self-start rounded-4xl'>
          <span className='duration-300 rounded-full text-xl md:text-2xl'><LuShoppingBag/></span>
          Start Shopping
        </Link>
      </div>
    </section>
  )
}

export default HeroSection