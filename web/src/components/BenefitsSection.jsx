import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import sanitizeDisplay from '../utils/textSanitize'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const 
BenefitsSection = ({ course, section }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 90% lighter and faster grid animation (y: 4px, scale: 0.99, duration: 0.25s, stagger: 0.02s)
      gsap.fromTo('.benefit-card',
        { opacity: 0, y: 4, scale: 0.99 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power3.out', stagger: 0.02,
          scrollTrigger: {
            trigger: '.benefit-grid',
            start: 'top 96%',
          }
        }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto py-20">
      <div className="grid grid-cols-1 min-[1301px]:grid-cols-[1fr_1.8fr] gap-12 min-[1301px]:gap-20 items-start mb-24 px-4 md:px-0">
        <div className="space-y-8 min-[1301px]:sticky min-[1301px]:top-32 transition-all duration-500">
          <h2 className="font-newsreader italic text-4xl md:text-5xl lg:text-6xl text-white font-extralight tracking-tight leading-[1.1]">
            {sanitizeDisplay(section?.title || "What You Will Achieve").split(' ').map((word, i, arr) => (
              <React.Fragment key={i}>
                {i === arr.length - 1 ? (
                  <span className="text-accent">{word}</span>
                ) : (
                  word + ' '
                )}
              </React.Fragment>
            ))}
          </h2>
          <div className="h-[2px] bg-accent/40 w-24" />
        </div>

        {section?.content && (
          <div className="min-[1301px]:border-l border-white/10 pl-0 min-[1301px]:pl-12 space-y-10 py-2">
            {section.content.blocks?.map((block, i) => (
              <p key={i} className={`font-montserrat leading-[1.8] tracking-wide ${i === 0 ? 'text-lg md:text-xl text-white/95 font-medium' : 'text-sm md:text-base text-white/70 font-light'}`}>
                {sanitizeDisplay(block.data?.text || '').replace(/&nbsp;/g, ' ')}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="benefit-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {section?.points?.map((feat, i) => (
          <div key={i} className="benefit-card border border-white/5 bg-white/[0.01] p-8 md:p-10 backdrop-blur-xl relative group hover:border-accent/40 transition-all duration-700">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
              <span className="font-jetbrains text-[40px] font-black text-accent">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_#8B5CF6]" />
              <span className="font-montserrat text-[12px] text-normal font-bold tracking-[0.2em] uppercase leading-relaxed">
                {feat}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default BenefitsSection
