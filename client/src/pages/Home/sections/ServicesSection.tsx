
const ServicesSection = () => {
  return (
    <section className='bg-linear-to-br from-[#2dbea6] to-[#2dbea6] inset-shadow-[4px_2px_10px_rgba(0,0,0,.2)] text-white overflow-hidden py-20'>
      <div className="text-nowrap">
        <h1 className='text-5xl text-center font-bold'>Our Quality</h1>
        <p className='text-center text-lg mt-1'>We provide high quality service for our customers</p>
      </div>
      <div className="flex justify-between grow gap-10 max-w-7xl mx-auto mt-10">
        {[...Array(3)].map((_)=>
          <div className="bg-white text-black flex-1 flex flex-col rounded-md overflow-hidden border border-gray-200">
            <div className="h-60 overflow-hidden flex justify-center">
              <img src="/mngr.jpg" className="h-full object-cover" alt=""/>
            </div>
            <div className="grow flex flex-col items-center p-6 bg-slate-50 border-t border-gray-200">
              <h1 className="text-2xl font-bold">We Fund</h1>
              <p className="text-wrap text-center my-2">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cumque harum eaque asperiores!</p>
              <button className="border px-4 py-2 mt-auto self-stretch">Learn More</button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ServicesSection