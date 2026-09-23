import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import RollingText from './RollingText'
import bannerImg from '../assets/images/banner.png'

const EventHero = ({ events }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef(null)
  const sliderRef = useRef(null)

  useEffect(() => {
    if (!events || events.length === 0) return

    // Auto-cycle logic
    const timer = setInterval(() => {
      handleNext()
    }, 5000)

    return () => clearInterval(timer)
  }, [currentIndex, events])

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % events.length
    
    // Sliding Animation: Right to Left
    const slides = gsap.utils.toArray('.event-slide')
    const currentSlide = slides[currentIndex]
    const nextSlide = slides[nextIndex]

    // Initialize next slide to the right
    gsap.set(nextSlide, { xPercent: 100, autoAlpha: 1, zIndex: 10 })
    gsap.set(currentSlide, { zIndex: 5 })

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(nextIndex)
        gsap.set(currentSlide, { autoAlpha: 0, zIndex: 0 })
      }
    })

    tl.to(currentSlide, {
      xPercent: -30,
      duration: 1.2,
      ease: 'power3.inOut'
    })
    .to(nextSlide, {
      xPercent: 0,
      duration: 1.2,
      ease: 'power3.inOut'
    }, 0)
  }

  return (
    <section ref={containerRef} className="relative w-full h-[350px] md:h-[600px] overflow-hidden bg-dark">
      
      {/* Slider Container */}
      <div ref={sliderRef} className="relative w-full h-full">
        {events.map((event, i) => (
          <div 
            key={i} 
            className={`event-slide absolute inset-0 w-full h-full overflow-hidden ${i === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Background Image */}
            <img  
              src={bannerImg} 
              alt="" 
              className=" inset-0 w-full h-full object-cover object-top"
            />
            {/* Event Specific Overlay Image / Element */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Subtle Gradient Branding Overlay */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60" />
            
          </div>
        ))}
      </div>

      {/* Dynamic Progress Indicator (Minimal) */}
      <div className="absolute bottom-8 right-12 flex gap-3 z-20">
         {events.map((_, i) => (
           <div 
             key={i} 
             className={`h-[2px] transition-all duration-700 ${i === currentIndex ? 'w-12 bg-accent' : 'w-4 bg-white/10'}`}
           />
         ))}
      </div>

    </section>
  )
}

export default EventHero
