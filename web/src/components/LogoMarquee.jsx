import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const logos = [
  { name: 'Hindustan Times', path: '/logo/hindustan_times.webp' },
  { name: 'India Today', path: '/logo/india_today.webp' },
  { name: 'The Week', path: '/logo/the_week.webp' },
  { name: 'Economic Times', path: '/logo/economic_times.webp' },
  { name: 'The Print', path: '/logo/the_print.webp' },
  { name: 'YourStory', path: '/logo/yourstory.webp' },
  { name: 'ANI', path: '/logo/ani.webp' },
  { name: 'Daily Hunt', path: '/logo/daily_hunt.webp' },
]

const LogoMarquee = () => {
  const sectionRef = useRef(null)
  const containerRef = useRef(null)
  const row1Ref = useRef(null)
  const row2Ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Perspective Reveal on Scroll
      // We start flat and small, then skew and scale into the "Logo Wall"
      gsap.fromTo(containerRef.current, 
        { 
          skewY: 0,
          scale: 0.98,
          opacity: 0,
        },
        {
          skewY: -2,
          scale: 1.02,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
            end: 'top 60%',
            scrub: 0.3,
          }
        }
      )

      // 2. Continuous Marquee Motion
      // Row 1 - Slides Left
      // Mathematical Loop: with 4 sets of logos, one full shift is exactly 25% of the total width
      gsap.to(row1Ref.current, {
        x: '-25%', 
        duration: 20, // Increased speed for premium momentum
        ease: 'none',
        repeat: -1,
      })

      // Row 2 - Slides Right
      gsap.set(row2Ref.current, { x: '-25%' })
      gsap.to(row2Ref.current, {
        x: '0%',
        duration: 20,
        ease: 'none',
        repeat: -1,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const denseLogos = [...logos, ...logos, ...logos, ...logos]

  return (
    <section 
      ref={sectionRef} 
      className="relative py-16 md:py-24 bg-gradient-to-b from-[#f8fafc] via-[#edf5fc]/70 to-[#f8fafc] z-10 select-none cursor-default overflow-hidden" 
    >
      
      {/* The Tilt Container - Perspective shift animates via GSAP ScrollTrigger */}
      <div 
        ref={containerRef} 
        className="flex flex-col gap-6 md:gap-10 will-change-transform"
      >
        
        {/* Row 1: High-Density Left */}
        <div className="relative flex whitespace-nowrap overflow-hidden">
          <div 
            ref={row1Ref} 
            className="flex items-center gap-10 md:gap-16 px-4 will-change-transform"
          >
            {denseLogos.map((logo, index) => (
              <img 
                key={`r1-${index}`}
                src={logo.path} 
                alt={logo.name} 
                className="pointer-events-auto h-9 md:h-14 lg:h-16 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-500 cursor-pointer object-contain"
              />
            ))}
          </div>
        </div>

        {/* Row 2: High-Density Right */}
        <div className="relative flex whitespace-nowrap overflow-hidden">
          <div 
            ref={row2Ref} 
            className="flex items-center gap-10 md:gap-16 px-4 will-change-transform"
          >
            {denseLogos.map((logo, index) => (
              <img 
                key={`r2-${index}`}
                src={logo.path} 
                alt={logo.name} 
                className="pointer-events-auto h-9 md:h-14 lg:h-16 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-500 cursor-pointer object-contain"
              />
            ))}
          </div>
        </div>

      </div>

      {/* Edge Gradient Masks to blend into background */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#f8fafc] to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#f8fafc] to-transparent z-20 pointer-events-none" />
    </section>
  )
}

export default LogoMarquee
// Force Vite HMR refresh
