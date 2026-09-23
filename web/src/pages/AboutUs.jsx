import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AboutUs = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo('.hero-animate',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out' }
      );

      // Section scroll animations
      gsap.utils.toArray('.scroll-section').forEach(section => {
        gsap.fromTo(section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
            }
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 text-slate-800 overflow-hidden pt-24 pb-20">

      {/* 1. HERO SECTION */}
      <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-100 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-100 rounded-full blur-[120px] -z-10" />

        <div className="hero-animate inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider mb-8 border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Our Story
        </div>

        <h1 className="hero-animate text-[clamp(2.5rem,6vw,5.5rem)] font-black text-slate-900 leading-[1.05] tracking-tight mb-8">
          Empowering Banking <br className="hidden md:block" />
          Professionals <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">Worldwide.</span>
        </h1>

        <p className="hero-animate text-lg md:text-2xl text-slate-600 max-w-3xl leading-relaxed font-medium">
          OS Academy is an elite online educational platform and preparation guide designed specifically for career advancement and promotional exams.
        </p>
      </section>

      {/* 2. STATS SECTION */}
      <section className="scroll-section px-6 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-100">
          {[
            { value: "100K+", label: "Active Students" },
            { value: "50+", label: "Expert Courses" },
            { value: "98%", label: "Success Rate" },
            { value: "24/7", label: "Learning Access" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center p-4">
              <span className="text-3xl md:text-5xl font-black text-slate-900 mb-2">{stat.value}</span>
              <span className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. WHO WE ARE & MISSION */}
      <section className="scroll-section px-6 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-square lg:aspect-auto lg:h-[600px]">
            <img
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Banking Professionals"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <h3 className="text-white text-3xl font-bold mb-3">Our Mission</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                To democratize high-quality banking education, providing every professional with the insights, skills, and tools necessary to clear crucial promotional exams and ascend the corporate ladder with confidence.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-8">
              More than just an <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">educational platform.</span>
            </h2>
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-medium">
              <p>
                We understand the unique pressures of the banking sector. Time is limited, and the competition for promotions is fierce. OS Academy was born out of a desire to streamline preparation.
              </p>
              <p>
                By combining industry-leading expertise with cutting-edge technology, we've created a learning ecosystem that adapts to your schedule. We distill vast amounts of financial regulations, banking protocols, and quantitative reasoning into digestible, high-yield lessons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY OFFERINGS */}
      <section className="scroll-section px-6 py-24 bg-slate-900 text-white mt-16 rounded-[3rem] mx-4 md:mx-10 relative overflow-hidden">
        {/* Dark theme decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Our Key Offerings</h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">Everything you need to excel in your banking career, consolidated into one powerful platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <path d="M22 10v6M2 10l10-5 10 5-10 5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
                title: "Exam Courses",
                desc: "Tailored preparation modules for IBPS RRB Scale II & III, SBI CBO, JAIIB, and Bank of Maharashtra GO."
              },
              {
                icon: <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
                title: "Live & Recorded Classes",
                desc: "Learn directly from industry veterans through interactive live sessions or watch recordings on your own schedule."
              },
              {
                icon: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
                title: "Topic-wise Practice",
                desc: "Test your knowledge with rigorous topic-wise practice tests designed to mimic real exam environments."
              },
              {
                icon: <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
                title: "Descriptive Writing & E-Books",
                desc: "Specialized modules for descriptive writing and a vast library of comprehensive e-books and notes."
              },
              {
                icon: <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
                title: "Computer Aptitude",
                desc: "Master computer awareness and aptitude, a crucial section in modern banking promotional exams."
              },
              {
                icon: <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
                title: "Previous Year Papers",
                desc: "Analyze and solve authentic previous year question papers to understand exam patterns and difficulty."
              }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors backdrop-blur-sm group">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    {item.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;
