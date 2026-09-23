import React from 'react'
import RollingText from './RollingText'
import bannerImg from '../assets/images/banner.png'

const MasterclassBanner = () => {
  return (
    <section className="relative w-full bg-dark overflow-x-hidden py-10 md:py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden border border-white/10 group shadow-2xl">
        
        <div className="relative overflow-hidden ">
        {/* <div className="relative overflow-hidden aspect-[16/9] md:aspect-[21/9]"> */}
          <img 
            src={bannerImg} 
            alt="Branding Masterclass" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Dynamic Overlay for Interactivity */}
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-4 lg:p-6 flex flex-col items-start gap-4 md:gap-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none">
          

          {/* Call to Action Row */}
          <div className="flex flex-col md:flex-row items-start gap-4 w-full md:w-auto pointer-events-auto">
            {/* Primary Accent Button */}
            <button className=" md:w-auto bg-accent text-dark px-10 py-5  font-montserrat text-[10px] font-bold tracking-[0.2em] relative overflow-hidden group/btn hover:scale-105 transition-all">
              <RollingText text="EXPLORE COURSES" className="relative z-10" />
            </button>

            {/* Ghost Watching Button */}
            <button className=" md:w-auto border border-white/20 text-normal px-10 py-5  font-montserrat text-[10px] font-bold tracking-[0.2em] relative overflow-hidden group/btn hover:bg-white/5 transition-all">
              <RollingText text="WATCH THE STORY" className="relative z-10" />
            </button>
          </div>

        </div>

        {/* Subtle Light Flare (Mirrors the glow in the image) */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[40%] h-[60%] bg-accent/10 blur-[120px] rounded-full pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />
      </div>
    </section>
  )
}

export default MasterclassBanner
