import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Background-only data
const ORBS = [
  { top: '20%', left: '20%', size: 30, blur: 1, delay: 0, dur: 7 },
  { top: '29%', left: '31%', size: 14, blur: 0, delay: 1.2, dur: 6 },
  { top: '38%', left: '15%', size: 12, blur: 1, delay: 0.6, dur: 8 },
  { top: '30%', left: '76%', size: 24, blur: 1, delay: 0.3, dur: 7.5 },
  { top: '60%', left: '92%', size: 16, blur: 1, delay: 1.8, dur: 6.5 },
  { top: '14%', left: '88%', size: 90, blur: 7, delay: 0.9, dur: 9 },
  { top: '68%', left: '9%', size: 60, blur: 6, delay: 2, dur: 9 },
  { top: '80%', left: '26%', size: 10, blur: 1, delay: 1.1, dur: 6 },
  { top: '10%', left: '8%', size: 50, blur: 5, delay: 0.4, dur: 8.5 },
  { top: '48%', left: '82%', size: 10, blur: 0, delay: 1.5, dur: 7 },
]

const SPARKLES = [
  { top: '24%', left: '27%', size: 14, delay: 0 },
  { top: '18%', left: '68%', size: 18, delay: 0.8 },
  { top: '44%', left: '88%', size: 12, delay: 1.6 },
  { top: '62%', left: '14%', size: 16, delay: 2.2 },
  { top: '14%', left: '45%', size: 10, delay: 1.1 },
  { top: '56%', left: '70%', size: 12, delay: 2.8 },
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
      className="relative h-[75vh] md:h-[80vh] md:max-h-[600px] bg-gradient-to-b from-[#8fc0ee] via-[#cde3f8] to-[#f4f8fc] flex flex-col items-center justify-end pb-12 md:pb-5 overflow-hidden select-none"
    >
      {/* Background-only keyframes */}
      <style>{`
        @keyframes heroOrbFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: .8; }
          50% { transform: translateY(-16px) scale(1.1); opacity: 1; }
        }
        @keyframes heroAurora {
          0%, 100% { transform: translate3d(0,0,0) scale(1); }
          33% { transform: translate3d(40px,-20px,0) scale(1.1); }
          66% { transform: translate3d(-30px,25px,0) scale(0.95); }
        }
        @keyframes heroWaveA {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-36px); }
        }
        @keyframes heroWaveB {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(30px); }
        }
        @keyframes heroSpin {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes heroRays {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes heroTwinkle {
          0%, 100% { opacity: 0; transform: scale(.4) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(45deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-bg-anim { animation: none !important; }
        }
      `}</style>

      {/* Background Design */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">

        {/* Aurora color blobs for depth */}
        <div className="hero-bg-anim absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full bg-[#4f9be0]/40 blur-[90px]" style={{ animation: 'heroAurora 18s ease-in-out infinite' }} />
        <div className="hero-bg-anim absolute top-0 -right-32 w-[560px] h-[560px] rounded-full bg-[#7fd0f5]/40 blur-[100px]" style={{ animation: 'heroAurora 22s ease-in-out -6s infinite' }} />
        <div className="hero-bg-anim absolute bottom-[-120px] left-1/3 w-[620px] h-[360px] rounded-full bg-white/70 blur-[80px]" style={{ animation: 'heroAurora 20s ease-in-out -3s infinite' }} />

        {/* Slow rotating light rays behind the subject */}
        <div
          className="hero-bg-anim absolute left-1/2 top-[34%] w-[900px] md:w-[1300px] h-[900px] md:h-[1300px] rounded-full opacity-60"
          style={{
            transform: 'translate(-50%, -50%)',
            background:
              'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.55) 14deg, transparent 32deg, transparent 90deg, rgba(255,255,255,0.4) 104deg, transparent 122deg, transparent 180deg, rgba(255,255,255,0.5) 194deg, transparent 212deg, transparent 270deg, rgba(255,255,255,0.4) 284deg, transparent 302deg)',
            WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 62%)',
            maskImage: 'radial-gradient(circle, black 0%, transparent 62%)',
            animation: 'heroRays 90s linear infinite',
          }}
        />

        {/* Bright halo behind head */}
        <div className="absolute left-1/2 top-[32%] -translate-x-1/2 -translate-y-1/2 w-[480px] md:w-[720px] h-[480px] md:h-[720px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.5)_35%,transparent_70%)] blur-xl" />

        {/* Back wave layer (slow) */}
        <svg
          className="hero-bg-anim absolute -left-[4%] bottom-0 w-[108%] h-full"
          style={{ animation: 'heroWaveA 20s ease-in-out infinite' }}
          viewBox="0 0 1440 600" preserveAspectRatio="none" fill="none"
        >
          <defs>
            <linearGradient id="hwBack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="hwLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 300 C 240 170, 460 140, 680 240 S 1100 380, 1440 190 L1440 600 L0 600 Z" fill="url(#hwBack)" />
          <path d="M0 300 C 240 170, 460 140, 680 240 S 1100 380, 1440 190" stroke="url(#hwLine)" strokeWidth="1.5" />
          <path d="M-20 240 C 180 110, 380 80, 560 160" stroke="url(#hwLine)" strokeWidth="1.2" />
          <path d="M-20 290 C 200 160, 400 130, 600 220" stroke="url(#hwLine)" strokeWidth="1" opacity="0.7" />
          <path d="M860 170 C 1040 80, 1240 110, 1460 50" stroke="url(#hwLine)" strokeWidth="1.2" />
          <path d="M820 250 C 1020 140, 1220 180, 1460 120" stroke="url(#hwLine)" strokeWidth="1" opacity="0.7" />
        </svg>

        {/* Front wave layer (opposite drift) */}
        <svg
          className="hero-bg-anim absolute -left-[4%] bottom-0 w-[108%] h-[85%]"
          style={{ animation: 'heroWaveB 16s ease-in-out infinite' }}
          viewBox="0 0 1440 500" preserveAspectRatio="none" fill="none"
        >
          <defs>
            <linearGradient id="hwFront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#f4f8fc" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="hwGloss" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 330 C 260 230, 520 250, 780 320 S 1200 400, 1440 290 L1440 500 L0 500 Z" fill="url(#hwFront)" />
          <path d="M0 330 C 260 230, 520 250, 780 320 S 1200 400, 1440 290" stroke="url(#hwGloss)" strokeWidth="2" />
          <path d="M0 365 C 280 275, 540 290, 800 350 S 1200 420, 1440 330" stroke="url(#hwGloss)" strokeWidth="1" opacity="0.6" />
        </svg>

        {/* Concentric rings around the head */}
        <div className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 w-[440px] md:w-[640px] h-[440px] md:h-[640px] rounded-full border border-white/80 shadow-[0_0_60px_rgba(255,255,255,0.6),inset_0_0_60px_rgba(255,255,255,0.4)]" />
        <div className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 w-[540px] md:w-[790px] h-[540px] md:h-[790px] rounded-full border border-white/35" />

        {/* Glowing dot orbiting the ring */}
        <div
          className="hero-bg-anim absolute left-1/2 top-[34%] w-[440px] md:w-[640px] h-[440px] md:h-[640px]"
          style={{ transform: 'translate(-50%, -50%)', animation: 'heroSpin 40s linear infinite' }}
        >
          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_16px_6px_rgba(255,255,255,0.9)]" />
        </div>

        {/* Glass bokeh orbs */}
        {ORBS.map((o, i) => (
          <span
            key={i}
            className="hero-bg-anim absolute rounded-full"
            style={{
              top: o.top,
              left: o.left,
              width: o.size,
              height: o.size,
              background:
                'radial-gradient(circle at 35% 30%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.1) 72%, rgba(255,255,255,0) 100%)',
              boxShadow: '0 0 ' + o.size * 0.8 + 'px rgba(255,255,255,0.7)',
              filter: `blur(${o.blur}px)`,
              animation: `heroOrbFloat ${o.dur}s ease-in-out ${o.delay}s infinite`,
            }}
          />
        ))}

        {/* Twinkling sparkles */}
        {SPARKLES.map((s, i) => (
          <svg
            key={i}
            className="hero-bg-anim absolute"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animation: `heroTwinkle 4.5s ease-in-out ${s.delay}s infinite`,
            }}
            viewBox="0 0 24 24"
          >
            <path d="M12 0 C12.8 8 16 11.2 24 12 C16 12.8 12.8 16 12 24 C11.2 16 8 12.8 0 12 C8 11.2 11.2 8 12 0Z" fill="#fff" />
          </svg>
        ))}

        {/* Soft fade at the bottom to blend into the next section */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#f4f8fc] to-transparent" />
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