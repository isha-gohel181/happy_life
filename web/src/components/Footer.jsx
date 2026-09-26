import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const Footer = () => {
  const footerRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-reveal', {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
        },
        y: 30,
        opacity: 0,
        filter: 'blur(10px)',
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out'
      })
    }, footerRef)

    requestAnimationFrame(() => {
      try { ScrollTrigger.refresh() } catch (e) { }
    })

    return () => ctx.revert()
  }, [])

  const socialLinks = [
    { name: 'Facebook', icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z', url: '#' },
    { name: 'X', icon: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154H7.594l5.243 6.932 6.064-6.933zm-1.292 19.49h2.039L6.486 3.24H4.298L17.61 20.644z', url: '#' },
    { name: 'Instagram', icon: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01', url: '#', isInsta: true },
    { name: 'YouTube', icon: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z M10 15V9l6 3z', url: '#' }
  ]

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-white text-slate-900 pt-20 pb-12 px-6 md:px-12 lg:px-20 overflow-hidden flex flex-col justify-between border-t border-slate-200/80"
    >
      {/* Top Accent Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D99B2A] to-transparent opacity-60" />

      {/* Brand & Statement Area */}
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center my-10 relative z-10">

        {/* Brand Logo & Name Container */}
        <div className="footer-reveal mb-8">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo/osa_logo.png" alt="OS Academy Logo" className="h-12 md:h-16 w-auto object-contain rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-xs" />
          </Link>
        </div>

        {/* Headline Slogan */}
        <div className="footer-reveal text-center space-y-2 mb-12">
          <h2 className="font-newsreader italic text-3xl md:text-5xl lg:text-6xl text-slate-900 font-bold tracking-tight leading-tight">
            {t('sloganMagic')} <span className="not-italic font-black text-[#D99B2A] uppercase tracking-tighter">{t('sloganMagicBold')}</span>
          </h2>
          <h2 className="font-newsreader italic text-3xl md:text-5xl lg:text-6xl text-slate-900 font-bold tracking-tight leading-tight">
            {t('sloganGuarantee')} <span className="not-italic font-black text-[#D99B2A] uppercase tracking-tighter">{t('sloganGuaranteeBold')}</span>
          </h2>
        </div>

        {/* Social Links Bar */}
        <div className="footer-reveal flex items-center justify-center gap-4 md:gap-6">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              className="w-11 h-11 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-[#D99B2A] hover:border-[#D99B2A] transition-all duration-300 shadow-xs hover:scale-110"
              aria-label={social.name}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {social.isInsta ? (
                  <>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </>
                ) : (
                  <path d={social.icon} fill={social.name === 'X' ? 'currentColor' : 'none'} stroke={social.name === 'X' ? 'none' : 'currentColor'} />
                )}
              </svg>
            </a>
          ))}
        </div>

      </div>

      {/* Bottom Links & Legal Bar */}
      <div className="footer-reveal max-w-6xl mx-auto w-full pt-10 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center text-center md:text-left">
          <p className="font-jetbrains text-sm text-slate-500 font-medium">© 2026 OS Academy. All rights reserved.</p>
        </div>

        {/* Nav Links */}
        <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3 font-jetbrains text-sm tracking-wide font-medium text-slate-600">
          <Link to="/about-us" className="hover:text-[#D99B2A] transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-[#D99B2A] transition-colors">Contact</Link>
          <Link to="/terms-conditions" className="hover:text-[#D99B2A] transition-colors">Terms & Conditions</Link>
          <Link to="/privacy-policy" className="hover:text-[#D99B2A] transition-colors">Privacy Policy</Link>
          <Link to="/refund-policy" className="hover:text-[#D99B2A] transition-colors">Refund Policy</Link>
        </div>

      </div>

      {/* Background Radial Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/5 blur-[140px] rounded-full" />
      </div>
    </footer>
  )
}

export default Footer
