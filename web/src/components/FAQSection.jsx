import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const faqData = {
  Content: [
    { id: "01", q: "How often is new content added?", a: "The transmission is persistent. We push architectural updates and new technical modules bi-weekly to ensure your stack remains ahead of market shifts." },
    { id: "02", q: "Are the courses suitable for beginners?", a: "The blueprint is designed to take you from zero to operational. While we move fast, the fundamental modules ensure no architect is left behind." },
    { id: "03", q: "How long do I have access to the content?", a: "Access is granted for the duration of your protocol (1, 3, or 12 months), with lifetime archive access available for our 'Founding Architect' tier." },
    { id: "04", q: "Can I revisit old courses after completing them?", a: "Yes. Your active subscription allows for unlimited revisits to any module you've unlocked to refine your implementation." },
    { id: "05", q: "Are the courses updated regularly?", a: "Systems evolve. We continuously calibrate our modules to reflect the latest in GSAP, React, and high-conversion editorial strategies." },
    { id: "06", q: "Can I interact with instructors during the courses?", a: "Direct technical calibration is available via the community forum and during scheduled live transmission sessions." },
    { id: "07", q: "Are there any prerequisites for the courses?", a: "Only a high-performance mindset. We provide the technical stack and training required to operate the Vanguard systems." },
    { id: "08", q: "Is there a certification upon completion?", a: "We provide a 'Vanguard Architect' digital credential upon successful deployment of your final operational project." },
    { id: "09", q: "Can I ask questions during live classes?", a: "Absolutely. Live sessions are designed for real-time problem solving and architectural audit of student projects." },
    { id: "10", q: "What if I miss a live class?", a: "Every session is archived within 24 hours. You can access the 'Deep Logs' at any time from your member dashboard." },
    { id: "11", q: "Can I complete the course if I buy 1 or 3 month plan?", a: "The curriculum is designed for speed. Focused architects can complete core modules in 30 days, though 3 months is recommended for full deployment." }
  ],
  Subscription: [
    { id: "01", q: "What are the benefits of subscribing?", a: "Immediate access to the full technical archive, private community network, and bi-weekly system updates." },
    { id: "02", q: "How do I subscribe to the course?", a: "Select your tier on the 'Initialize' page. Once payment is verified, your technical dashboard will be activated immediately." },
    { id: "03", q: "Can I upgrade or downgrade my plan?", a: "Yes. You can calibrate your access level at any time from your 'Subscription Settings'. Changes take effect at the start of the next cycle." },
    { id: "04", q: "What is the refund policy for subscriptions?", a: "We operate on an Integrity Protocol. If the system fails to deliver within 30 days of active implementation, we initiate a total refund." },
    { id: "05", q: "Can I share my subscription with others?", a: "Accounts are individual 'Node' access points. Sharing login credentials may result in automated security termination." },
    { id: "06", q: "What payment methods are accepted?", a: "We accept all major credit cards, Stripe, and crypto-transfers for our 'Founding Architect' annual plans." },
    { id: "07", q: "What if I encounter subscription issues?", a: "Our technical support team is standing by. Reach out via the support portal for immediate node resolution." },
    { id: "08", q: "Can I pause my subscription?", a: "Yes. You can put your architectural training on 'Standby' for up to 3 months without losing your historical progress." },
    { id: "09", q: "Is there a free trial available?", a: "We offer curated 'Preview Transmissions' for specific modules to let you sample the technical depth before full initialization." }
  ],
  Technical: [
    { id: "01", q: "What are the requirements for access?", a: "A modern workstation, a stable internet connection, and the current version of Chrome or Firefox for implementation." },
    { id: "02", q: "What if I forget my login credentials?", a: "Use the 'Recover Access' protocol on the login page. An encryption-reset link will be sent to your registered email node." },
    { id: "03", q: "Is the platform mobile compatible?", a: "The dashboard is fully responsive. You can consume content on mobile, but implementation requires a desktop environment." },
    { id: "04", q: "Can I access the content offline?", a: "Core curriculum videos require an active data link. However, project blueprints and code snippets are available for download." },
    { id: "05", q: "Can I access the course on my browser?", a: "Yes. The Vanguard experience is a web-based operating system designed for the latest browser standards." },
    { id: "06", q: "How do I report a technical problem?", a: "Submit a 'Bug Report' via the sidebar. Include your browser console logs for faster technical resolution." },
    { id: "07", q: "Will my data be secure on the platform?", a: "We use end-to-end encryption for all personal nodes and project data. Your architectural IP stays yours." },
    { id: "08", q: "What if a video doesn't play?", a: "Ensure your cache is cleared and hardware acceleration is enabled. If persistence fails, contact the technical node." },
    { id: "09", q: "How do I clear my browser cache?", a: "Access your browser preferences, locate 'Privacy & Security', and clear cached images and files for node calibration." },
    { id: "10", q: "What if I encounter audio/video sync issues?", a: "This usually occurs during local memory throttling. Restart your browser instance or toggle hardware acceleration." }
  ]
}

const FAQSection = () => {
  const [activeTab, setActiveTab] = useState('Content')
  const [hoveredId, setHoveredId] = useState(null)
  const containerRef = useRef(null)
  const { t } = useLanguage()

  const categories = ['Content', 'Subscription', 'Technical']

  // Handle dynamic FAQ data if passed via props or state
  const dynamicFaqData = faqData;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.faq-box',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          }
        }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [activeTab])

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto py-20 relative">

      {/* 1. Header Area with Mode Switcher */}
      <div className="space-y-8 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-[1px] bg-accent" />
          <span className="font-jetbrains text-[9px] text-accent tracking-[1em] uppercase font-bold">{t('faqTitle')}</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <h2 className="font-newsreader italic text-4xl md:text-6xl text-normal font-extralight tracking-tighter leading-tight">
            {t('faqSubtitle')}
          </h2>

          <div className="flex gap-6 border-b border-white/5 pb-2 overflow-x-auto no-scrollbar">
            {categories.map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                  setHoveredId(null)
                }}
                className={`font-montserrat text-[14px] tracking-[0.4em] uppercase font-black transition-all duration-500 pb-2 relative whitespace-nowrap
                       ${activeTab === tab ? 'text-normal' : 'text-description/80 hover:text-description'}`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-accent" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Full-Width Industrial Nodes */}
      <div className="space-y-4">
        {dynamicFaqData[activeTab]?.map((item, i) => (
          <div
            key={item.id}
            className={`faq-box group border border-slate-200 bg-white hover:bg-slate-50 hover:border-amber-400 transition-all duration-500 rounded-2xl shadow-sm overflow-hidden
              ${hoveredId === item.id ? 'bg-amber-50/40 border-amber-400/80 shadow-md' : ''}`}
          >
            <button
              onClick={() => setHoveredId(hoveredId === item.id ? null : item.id)}
              className="w-full flex items-center justify-between p-5 md:p-6 text-left"
            >
              <div className="flex items-center gap-4">
                <h4 className="font-newsreader italic text-xl md:text-2xl text-slate-900 text-start font-extralight tracking-tight leading-tight group-hover:text-amber-700 transition-colors">
                  {item.q}
                </h4>
              </div>

              <div className={`shrink-0 w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center transition-all duration-500
                 ${hoveredId === item.id ? 'rotate-[225deg] border-amber-400 bg-accent text-slate-950' : 'bg-slate-50'}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={hoveredId === item.id ? 'stroke-slate-950' : 'stroke-slate-600'}>
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
            </button>

            {/* Answer Body - Smooth Accordion Reveal */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden
              ${hoveredId === item.id ? 'max-h-[500px] opacity-100 p-5 md:p-6 pt-0' : 'max-h-0 opacity-0'}`}>
              <div className="border-t border-slate-100 pt-6">
                <p className="font-montserrat text-sm text-slate-700 leading-relaxed max-w-3xl font-medium">
                  {item.a}
                </p>
              </div>

              {/* Metadata Status Line */}
              <div className="mt-6 flex items-center gap-4 opacity-40">
                <div className="h-[1px] w-8 bg-accent" />
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}

export default FAQSection
