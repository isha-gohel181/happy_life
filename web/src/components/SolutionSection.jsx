import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import sanitizeDisplay from '../utils/textSanitize'

gsap.registerPlugin(ScrollTrigger)

const SolutionSection = ({ course, section }) => {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Reveal headers and descriptions (90% lighter)
      gsap.utils.toArray('.sol-title').forEach((title) => {
        gsap.fromTo(title,
          { opacity: 0, y: 6 },
          {
            opacity: 1, y: 0,
            duration: 0.35, ease: 'power3.out',
            scrollTrigger: { trigger: title, start: 'top 95%' }
          }
        )
      })

      gsap.utils.toArray('.sol-desc').forEach((desc) => {
        gsap.fromTo(desc,
          { opacity: 0, y: 4 },
          {
            opacity: 1, y: 0,
            duration: 0.3, ease: 'power3.out',
            scrollTrigger: { trigger: desc, start: 'top 95%' }
          }
        )
      })

      // 2. Individual Point Grid Cards (challenges & outcomes)
      // Iterating individually ensures each card animates only when it crosses its own trigger line.
      gsap.utils.toArray('.sol-point').forEach((point, i) => {
        gsap.fromTo(point,
          { opacity: 0, x: -4, scale: 0.99 },
          {
            opacity: 1, x: 0, scale: 1,
            duration: 0.25,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: point,
              start: 'top 95%'
            }
          }
        )
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  // Process EditorJS content for the description text blocks
  const descriptionBlocks = section?.content?.blocks?.map(block => 
    sanitizeDisplay(block.data?.text || '').replace(/&nbsp;/g, ' ')
  ) || [];

  return (
    <section ref={ref} className="max-w-7xl mx-auto py-20">
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent mb-16" />

      <div className="grid grid-cols-1 min-[1301px]:grid-cols-[1fr_1.8fr] gap-12 min-[1301px]:gap-20 items-start mb-28 px-4 md:px-0">
        <div className="space-y-8 min-[1301px]:sticky min-[1301px]:top-32 transition-all duration-500">
          <h2 className="sol-title font-newsreader italic text-4xl md:text-5xl lg:text-6xl text-white font-extralight tracking-tight leading-[1.1]">
            {sanitizeDisplay(section?.title || "The Solution").split(' ').map((word, i, arr) => (
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

        <div className="min-[1301px]:border-l border-white/10 pl-0 min-[1301px]:pl-12 py-2">
          <div className="space-y-4">
            {descriptionBlocks.map((text, i) => (
              <p key={i} className={`font-montserrat leading-[1.8] tracking-wide ${i === 0 ? 'text-lg md:text-xl text-white/95 font-medium' : 'text-sm md:text-base text-white/70 font-light'}`}>
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* What we Solve Section (Challenges - Red X) */}
      {(section?.outcomeTitle || (section?.outcomePoints && section.outcomePoints.length > 0)) && (
        <div className="space-y-16 mb-20">
          {section?.outcomeTitle && (
            <div className="text-center">
              <h3 className="sol-title font-newsreader italic text-3xl md:text-5xl text-normal font-extralight tracking-tight">
                {sanitizeDisplay(section.outcomeTitle)}
              </h3>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {section?.outcomePoints?.map((p, i) => (
              <div key={i} className="sol-point group flex  items-center gap-5 px-6 py-5 bg-red-500/[0.2] border-l-2 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.02)] transition-all duration-500">
                <div className="w-8 h-8 rounded-full border border-red-500/40 flex items-center justify-center shrink-0 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </div>
                <span className="font-montserrat text-sm text-red-400 font-normal tracking-wide uppercase italic">{sanitizeDisplay(p)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Solutions Section (Outcomes - Green Check) */}
      <div className="space-y-16">
        {section?.solutionTitle && (
          <div className="text-center">
            <h3 className="sol-title font-newsreader italic text-3xl md:text-5xl text-normal font-extralight tracking-tight">
              {sanitizeDisplay(section.solutionTitle)}
            </h3>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {section?.points?.map((p, i) => (
            <div key={i} className="sol-point group flex items-center gap-5 px-6 py-5 bg-accent/[0.2] border-l-2 border-accent shadow-[0_0_30px_rgba(139, 92, 246,0.08)] transition-all duration-500">
              <div className="w-8 h-8 rounded-full border border-accent/60 flex items-center justify-center shrink-0 bg-accent/20 shadow-[0_0_15px_rgba(139, 92, 246,0.5)]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="4"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
              <span className="font-montserrat text-sm text-accent font-normal tracking-wide uppercase">{sanitizeDisplay(p)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent mt-20" />
    </section>
  )
}

export default SolutionSection
