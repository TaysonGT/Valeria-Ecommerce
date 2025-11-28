import { Link } from 'react-router'
import Hero from '../../../assets/imgs/landing/hero.webp';
import Navbar from '../../../components/Navbar/Navbar';

const HeroSection = () => {
  return (
    <section className='min-h-screen flex-col overflow-hidden flex relative bg-linear-to-br from-red-800 to-amber-800'>
        <Navbar/>
        {/* <div className='flex grow p-6  px-20'> */}
          <div className='absolute top-0 left-0 h-full w-full opacity-10'>
            <img className='w-full h-full object-cover object-center rounded-xl' loading='lazy' src={Hero}/>
          </div>
          <div className="relative grow z-[2] pr-5 text-white max-w-7xl w-full mx-auto flex flex-col justify-center font-[Comfortaa]">
            <div className='text-8xl leading-28 font-bold'>
              <h1>Elegance</h1>
              <h1>Charisma</h1>
              <h1>Simplicity</h1>
            </div>
            <p className='mt-6 text-base text-wrap w-1/2'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi praesentium quia delectus mollitia at quibusdam assumenda maiores quae, est.</p>
            <Link to='/' className='py-3 px-6 hover:bg-transparent cursor-pointer font-bold text-lg bg-[#399283] text-white rtl duration-300 text-nowrap items-center justify-center gap-2 border-3 border-[#399283] before:bg-[#399283] hover:border-white self-start mt-10'>
              Start Shopping
            </Link>
          </div>
        {/* </div> */}
    </section>
  )
}

export default HeroSection