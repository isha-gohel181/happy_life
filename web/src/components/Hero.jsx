import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../context/LanguageContext'

const Hero = ({ isLoaded }) => {
   const containerRef = useRef(null)
   const contentRef = useRef(null)
   const imageRef = useRef(null)
   const glassCard1 = useRef(null)
   const glassCard2 = useRef(null)
   const { t } = useLanguage()

   useEffect(() => {
      if (!isLoaded) return;

      const ctx = gsap.context(() => {
         const tl = gsap.timeline({
            defaults: { ease: 'expo.out', duration: 1.5 }
         })

         gsap.to(containerRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.1 })
         gsap.set('.reveal-up', { y: 60, opacity: 0 })
         gsap.set(imageRef.current, { scale: 1.1, opacity: 0 })
         gsap.set([glassCard1.current, glassCard2.current], { scale: 0.9, opacity: 0, y: 30 })

         tl.to(imageRef.current, { scale: 1, opacity: 0.8, duration: 2.5 })
            .to('.reveal-up', { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.15 }, '-=2.0')
            .to(glassCard1.current, { scale: 1, opacity: 1, y: 0, duration: 1.2 }, '-=1.5')
            .to(glassCard2.current, { scale: 1, opacity: 1, y: 0, duration: 1.2 }, '-=1.3')

         // Continuous float animation for glass cards
         gsap.to(glassCard1.current, { y: '-=15', duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' })
         gsap.to(glassCard2.current, { y: '+=10', duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      }, containerRef)

      return () => ctx.revert()
   }, [isLoaded])

   return (
      <section ref={containerRef} className="relative min-h-[90vh] md:min-h-[100vh] bg-slate-50 flex items-center justify-center overflow-hidden opacity-0 pointer-events-none transition-opacity duration-300 pt-36 md:pt-44 pb-20">

         {/* Dynamic Animated Gradient Mesh Background */}
         <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-accent/20 rounded-full blur-[120px] animate-pulse mix-blend-screen" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-cyan-600/10 rounded-full blur-[150px] mix-blend-screen" />
            <div className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] bg-accent/10 rounded-full blur-[100px] mix-blend-screen" />
            {/* Subtle Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] [background-size:200px_200px]" />
         </div>

         {/* Main Container - Asymmetrical Layout */}
         <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">

            {/* Left Side: Typography */}
            <div ref={contentRef} className="flex flex-col items-start space-y-8 pt-4 md:pt-0">
               <div className="reveal-up flex items-center gap-4 border border-amber-300/40 bg-amber-50/80 px-4 py-2 rounded-full backdrop-blur-md">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-accent-soft" />
                  <span className="font-inter text-[10px] md:text-xs text-amber-700 uppercase tracking-widest font-black">
                     {t('heroBadge')}
                  </span>
               </div>

               <div className="flex flex-col w-full">
                  <h1 className="reveal-up font-inter text-[clamp(2.5rem,6vw,5.5rem)] text-slate-900 font-black leading-[1.05] tracking-tight">
                     {t('heroTitleLine1')} <br className="hidden lg:block" />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600">{t('heroTitleLine2')}</span>
                  </h1>
               </div>

               <p className="reveal-up font-inter text-lg md:text-xl text-slate-600 max-w-lg leading-relaxed font-medium">
                  {t('heroDesc')}
               </p>

               <div className="reveal-up pt-4 flex gap-6 w-full flex-col sm:flex-row">
                  <button className="bg-accent text-slate-950 font-black px-10 py-5 rounded-full font-inter text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-accent-soft flex items-center justify-center gap-4 group">
                     {t('getStarted')}
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-1 transition-transform stroke-slate-950">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2.5" />
                     </svg>
                  </button>
                  <button className="px-10 py-5 rounded-full font-inter text-xs font-bold uppercase tracking-widest border border-slate-300 text-slate-800 hover:bg-slate-100 transition-all flex items-center justify-center">
                     {t('exploreCourses')}
                  </button>
               </div>
            </div>

            {/* Right Side: Image & Floating Glass Cards */}
            <div className="relative h-[60vh] lg:h-[80vh] w-full flex items-center justify-center mt-12 lg:mt-0">
               {/* Subject Image */}
               <img
                  ref={imageRef}
                  src="/bannner.png"
                  alt="Bankers Grade"
                  className="absolute bottom-0 h-[90%] md:h-[100%] w-auto max-w-none object-contain drop-shadow-xl"
                  style={{
                     maskImage: 'linear-gradient(to bottom, black 70%, transparent 98%)',
                     WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 98%)'
                  }}
               />

               {/* Floating Metric 1 */}
               <div
                  ref={glassCard1}
                  className="absolute top-[20%] left-0 md:-left-12 lg:-left-20 bg-white/90 backdrop-blur-2xl border border-slate-200 p-5 rounded-2xl shadow-xl flex items-center gap-4"
               >
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center border border-amber-300">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-amber-700 stroke-2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                     </svg>
                  </div>
                  <div className="flex flex-col">
                     <span className="font-inter text-2xl font-black text-slate-900 leading-none">100K+</span>
                     <span className="font-inter text-[9px] text-slate-500 uppercase tracking-widest font-bold mt-1">{t('activeStudents')}</span>
                  </div>
               </div>

               {/* Floating Metric 2 */}
               <div
                  ref={glassCard2}
                  className="absolute bottom-[25%] right-0 md:-right-8 lg:-right-12 bg-white/90 backdrop-blur-2xl border border-slate-200 p-5 rounded-2xl shadow-xl flex items-center gap-4"
               >
                  <div className="flex flex-col items-end text-right">
                     <span className="font-inter text-2xl font-black text-slate-900 leading-none">4.9/5</span>
                     <span className="font-inter text-[9px] text-slate-500 uppercase tracking-widest font-bold mt-1">{t('averageRating')}</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center border border-cyan-200">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-cyan-500">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                     </svg>
                  </div>
               </div>
            </div>

         </div>

      </section>
   )
}

export default Hero
