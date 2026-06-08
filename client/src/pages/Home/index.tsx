import React from 'react'
import FeaturedSection from './sections/Featured';
import HeroSection from './sections/Hero';
import CategoriesSection from './sections/Categories';
import TestimonialsSection from './sections/Testimonials';
import TrendingSection from './sections/Trending';
import LimitedOffer from './sections/LimitedOffer';
import SubscriptionSection from './sections/Subscription';


const HomePage: React.FC = ()=>{
  return (
    <div className=''>
      <HeroSection/>
      <div className='w-full overflow-x-hidden py-6 bg-[#98eee0] font-[Elms_Sans]'>
        <div className='flex justify-between items-center max-w-7xl px-10 w-full mx-auto'>
          {[...Array(5)].map((_i,x)=>
            <div key={x}>
              <p className='uppercase text-lg font-bold'>{x%2===0?'Buy 2 Get 1 Free':'Special Offer'}</p>
              <span className='not-last:block hidden h-1 aspect-square rounded-full bg-[#737373]'/>
            </div>
          )}
        </div>
      </div>
      <TrendingSection/>
      <FeaturedSection/>
      <CategoriesSection/>
      <LimitedOffer/>
      <TestimonialsSection/>
      <SubscriptionSection/>
      <div className='bg-[#1f1f1f] text-white text-center py-4'>
        © Valeria 2025
      </div>
    </div>
  )
}

export default HomePage