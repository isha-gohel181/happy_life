import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Background-only data: soft bokeh orbs (position, size, blur, float timing)
const ORBS = [
  { top: '22%', left: '21%', size: 26, blur: 1, delay: 0, dur: 7 },
  { top: '28%', left: '31%', size: 14, blur: 0, delay: 1.2, dur: 6 },
  { top: '36%', left: '17%', size: 12, blur: 1, delay: 0.6, dur: 8 },
  { top: '30%', left: '75%', size: 22, blur: 1, delay: 0.3, dur: 7.5 },
  { top: '58%', left: '93%', size: 14, blur: 1, delay: 1.8, dur: 6.5 },
  { top: '16%', left: '88%', size: 70, blur: 6, delay: 0.9, dur: 9 },
  { top: '70%', left: '11%', size: 44, blur: 5, delay: 2, dur: 9 },
  { top: '78%', left: '24%', size: 10, blur: 1, delay: 1.1, dur: 6 },
  { top: '12%', left: '9%', size: 40, blur: 4, delay: 0.4, dur: 8.5 },
]

const Hero = ({ isLoaded = true }) => {
  const containerRef = useRef(null)
  const taglineRef = useRef(null)
  const heading1Ref = useRef(null)
  const heading2Ref = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    if (isLoaded === false) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ 
        defaults: { ease: 'expo.out', duration: 1.5 }
      })

      if (imageRef.current) {
        tl.fromTo(imageRef.current, 
          { scale: 1.15, opacity: 0, filter: 'blur(12px)' },
          { scale: 1, opacity: 0.75, filter: 'blur(0px)', duration: 2.2 }
        )
      }

      const textEls = [taglineRef.current, heading1Ref.current, heading2Ref.current].filter(Boolean)
      if (textEls.length > 0) {
        tl.fromTo(textEls, 
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.12, duration: 1.2 },
          '-=1.8'
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [isLoaded])

  return (
    <section 
      ref={containerRef} 
      className="relative h-[75vh] md:h-[80vh] md:max-h-[600px] bg-gradient-to-b from-[#a8cdf0] via-[#d3e6f8] to-[#f4f8fc] flex flex-col items-center justify-end pb-12 md:pb-5 overflow-hidden select-none"
    >
      {/* Background-only keyframes */}
      <style>{`
        @keyframes heroOrbFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: .85; }
          50% { transform: translateY(-14px) scale(1.08); opacity: 1; }
        }
        @keyframes heroWaveDrift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-24px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-orb, .hero-wave { animation: none !important; }
        }
      `}</style>

      {/* Background Design: waves, ring, glow, bokeh */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Soft central light behind the subject */}
        <div className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 w-[520px] md:w-[760px] h-[520px] md:h-[760px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.35)_40%,transparent_70%)] blur-2xl" />

        {/* Flowing wave layers */}
        <svg
          className="hero-wave absolute -left-[3%] bottom-0 w-[106%] h-full"
          style={{ animation: 'heroWaveDrift 14s ease-in-out infinite' }}
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="heroWaveFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 330 C 220 210, 420 150, 640 250 S 1060 400, 1440 220 L1440 600 L0 600 Z" fill="url(#heroWaveFill)" />
          <path d="M0 420 C 260 320, 520 330, 760 400 S 1180 470, 1440 340 L1440 600 L0 600 Z" fill="url(#heroWaveFill)" opacity="0.8" />
          <path d="M-20 250 C 180 120, 380 90, 560 170" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.2" />
          <path d="M-20 300 C 200 170, 400 140, 600 230" stroke="#fff" strokeOpacity="0.45" strokeWidth="1" />
          <path d="M860 180 C 1040 90, 1240 120, 1460 60" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.2" />
          <path d="M820 260 C 1020 150, 1220 190, 1460 130" stroke="#fff" strokeOpacity="0.4" strokeWidth="1" />
          <path d="M0 360 C 240 250, 480 260, 720 340 S 1160 430, 1440 300" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.2" />
        </svg>

        {/* Thin circular arc framing the head */}
        <div className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 w-[440px] md:w-[640px] h-[440px] md:h-[640px] rounded-full border border-white/70 shadow-[0_0_40px_rgba(255,255,255,0.5)_inset]" />
        <div className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 w-[520px] md:w-[760px] h-[520px] md:h-[760px] rounded-full border border-white/30" />

        {/* Bokeh orbs */}
        {ORBS.map((o, i) => (
          <span
            key={i}
            className="hero-orb absolute rounded-full"
            style={{
              top: o.top,
              left: o.left,
              width: o.size,
              height: o.size,
              background:
                'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0) 72%)',
              filter: `blur(${o.blur}px)`,
              animation: `heroOrbFloat ${o.dur}s ease-in-out ${o.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Background Portrait Image & Glow */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <img 
          ref={imageRef}
          src="/hero_image_2.png" 
          alt="Dr. Yogesh Sharma" 
          className="h-[80%] md:h-[100%] w-auto max-w-none object-contain opacity-75 brightness-90 translate-y-10 md:translate-y-20"
          style={{
            maskImage: 'linear-gradient(to bottom, black 60%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 95%)'
          }}
        />
        {/* Soft vignette to ground subject */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f4f8fc] via-transparent to-transparent opacity-85" />
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 w-full max-w-7xl px-4 md:px-8 flex flex-col items-center focus:outline-none">
        
        <div className="w-fit flex flex-col items-start space-y-3 md:space-y-4">
          {/* Top Tagline */}
          <div ref={taglineRef} className="flex items-center justify-start gap-4">
            <span className="font-jetbrains text-[9px] md:text-xs text-accent uppercase tracking-[0.4em] font-medium">
              -- ALIGN YOUR ENERGY • UNLOCK SUCCESS
            </span>
          </div>

          {/* Main Headings */}
          <div className="flex flex-col items-center md:items-start text-center md:text-start w-full px-2">
            <h1 
              ref={heading1Ref} 
              className="font-inter text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] xl:text-[5.4rem] text-slate-900 leading-[0.92] md:leading-[0.88] tracking-[-0.015em] break-words md:whitespace-nowrap font-extralight"
              style={{ fontWeight: 200 }}
            >
              Astrology & Vastu that
            </h1>
            <h1 
              ref={heading2Ref} 
              className="font-inter text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] xl:text-[5.4rem] text-slate-900 leading-[0.92] md:leading-[0.88] tracking-[-0.015em] break-words md:whitespace-nowrap mt-1 md:mt-2 font-extralight"
              style={{ fontWeight: 200 }}
            >
              <span className="italic text-accent mr-2.5 font-extralight" style={{ fontWeight: 200 }}>actually</span>
              <span>transforms your life</span>
            </h1>
          </div>
        </div>

      </div>

      {/* Decorative top gradient for floating navbar contrast */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-accent/15 to-transparent pointer-events-none" />
    </section>
  )
}

export default Hero