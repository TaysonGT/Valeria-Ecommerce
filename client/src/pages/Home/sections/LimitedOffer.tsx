import { Link } from 'react-router'
import { FiArrowRight } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { LuClock12 } from 'react-icons/lu'

const LimitedOffer = () => {
  const [clock, setClock] = useState(0)
  const [endDate, setEndDate] = useState(new Date().setHours(new Date().getHours()+2))

  const displayClock = (time:number)=>{
    const d = Math.floor(time/60/60/24)
    const h = Math.floor(time/60/60)%60
    const m = Math.floor(time/60)%60
    const s = time%60

    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`
  }

  const decrement = ()=>{
    let time =  Math.floor((new Date(endDate).getTime() - new Date().getTime()) /1000)
    setClock(time)
    if (time>0) {
      setClock(time)
    }else{
      setClock(0)
    }
  }

  useEffect(()=>{
    const newinterval = setInterval(decrement,1000)
    return ()=> clearInterval(newinterval)
  },[])

  return (
    <section className='bg-white border-6 border-amber-300 font-sans'>
      <div className='w-full flex items-center relative bg-[url(/imgs/landing/limited-offer.jpg)] bg-no-repeat bg-cover bg-center'>
        <div className='p-20 flex flex-col gap-6 h-full bg-linear-to-l from-black/30 to-black/90 w-full'>
          <div className='flex items-center justify-between gap-10 '>
            <p className='text-5xl text-red-400 font-light font-[Elms_Sans]'>Limited Edition</p>
            <div className='bg-red-500/50 py-6 px-8 pl-6 border border-white text-white font-extrabold font-[Elms_Sans] text-5xl flex items-center gap-4'>
              <LuClock12 className=''/>
              <p>{displayClock(clock)}</p>
            </div>
          </div>
          <p className='text-white text-9xl font-extrabold leading-tight uppercase'>Buy 2 <span className='text-amber-300'>Get</span> <span className='text-red-500'>1 Free</span></p>
          <Link to={'/shop'} className='text-5xl flex gap-4 items-center bg-black text-white self-start px-10 pr-4 py-4 rounded-full font-[Elms_Sans] hover:bg-white hover:text-black duration-200 border-white border cursor-pointer'>
            Discover Offers
            <FiArrowRight className='text-5xl'/>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default LimitedOffer