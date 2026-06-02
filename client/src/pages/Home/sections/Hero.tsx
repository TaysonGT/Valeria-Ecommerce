import { LuArrowUpRight } from "react-icons/lu";

import { Link } from 'react-router'

const HeroSection = () => {
  return (
    <section className='min-h-[calc(100vh-96px)] text-[#1e1e1e] z-2 space-y-8 bg-[url(/imgs/landing/hero.jpg)] bg-cover px-20 py-10 xl:px-30 w-full justify-center font-[Comfortaa] flex-col overflow-hidden flex relative'>
      <div className='md:text-7xl leading-tight text-6xl 2xl:text-8xl font-medium font-[Titan_One]'>
        <h1>Elegance</h1>
        <h1>Redefined</h1>
        <h1>Style</h1>
      </div>
      <p className='text-xl text-wrap md:w-1/2'>Discover curated fashion and lifestyle products that reflect your unique personality.</p>
      <Link to='/shop' className='p-2 pl-6 flex group items-center hover:bg-transparent cursor-pointer font-bold text-lg text-white bg-[#1e1e1e] ltr duration-300 text-nowrap justify-center gap-3 border-3 border-[#1e1e1e] before:bg-white hover:text-[#1e1e1e] self-start rounded-4xl'>
        Start Shopping
        <span className='p-1.5 border-2 duration-300 border-white group-hover:border-[#1e1e1e] rounded-full text-2xl'><LuArrowUpRight/></span>
      </Link>
    </section>
  )
}

export default HeroSection