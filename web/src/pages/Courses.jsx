import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses } from '../redux/slices/courseSlice'
import RollingText from '../components/RollingText'
import CourseCard from '../components/CourseCard'
import EventHero from '../components/EventHero'
import { fetchEvents } from '../redux/slices/eventSlice'
import { useLanguage } from '../context/LanguageContext'

import { eventData } from '../constants/events'

const courseData = [
  {
    id: 1,
    category: 'EDITORIAL DESIGN',
    title: 'The Architecture of the Page',
    description: 'Mastering grid systems and visual tension in high-end publishing.',
    price: '$249.00',
    image: '/courses/architecture.png',
    isNew: true,
  },
  {
    id: 2,
    category: 'TYPOGRAPHY',
    title: 'The Romantic Serif',
    description: 'History and application of intricate display typefaces in digital systems.',
    price: '$189.00',
    image: '/courses/typography.png',
  },
  {
    id: 3,
    category: 'CURATION',
    title: 'The Digital Curator',
    description: 'Transitioning from content manager to high-end content architect.',
    price: '$322.00',
    image: '/courses/curator.png',
  },
  {
    id: 4,
    category: 'ART DIRECTION',
    title: 'Visual Narrative & Identity',
    description: 'Building cohesive brand worlds through cinematic storytelling.',
    price: '$599.00',
    image: '/courses/narrative.png',
  },
  {
    id: 5,
    category: 'DIGITAL ART',
    title: 'Motion & Tonal Stacking',
    description: 'Creating depth and atmosphere without traditional drop shadows.',
    price: '$420.00',
    image: '/courses/motion.png',
  },
  {
    id: 6,
    category: 'PROFESSIONAL PRACTICE',
    title: 'Pricing the Premium',
    description: 'The economics of high-end design services and luxury positioning.',
    price: '$144.00',
    image: '/courses/pricing.png',
  }
]


const Courses = () => {
  const dispatch = useDispatch()
  const { courses, loading, error } = useSelector((state) => state.courses)
  const { eventList, loading: eventsLoading } = useSelector((state) => state.events)
  const containerRef = useRef(null)
  const { t } = useLanguage()
  const [activeFilter, setActiveFilter] = useState('ALL COURSES')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedDuration, setSelectedDuration] = useState('All hours')
  const advancedRef = useRef(null)
  const [hasFetchedEvents, setHasFetchedEvents] = useState(false)

  const filteredCourses = useMemo(() => {
    return (courses || []).filter(item => {
      // 1. Category Filter
      const matchesCategory = (() => {
        if (activeFilter === 'ALL COURSES') return true;
        const courseCat = (item.category?.name || item.category || '').toUpperCase();
        const filterCat = activeFilter.toUpperCase();
        return courseCat === filterCat || courseCat.includes(filterCat) || filterCat.includes(courseCat);
      })();

      // 2. Difficulty Filter
      const matchesDifficulty = (() => {
        if (selectedDifficulty === 'All') return true;
        const filterDiff = selectedDifficulty.toLowerCase();
        
        if (item.level && Array.isArray(item.level) && item.level.length > 0) {
          return item.level.some(l => l.toLowerCase() === filterDiff);
        }
        
        const courseDiff = (item.difficulty || '').toLowerCase();
        if (filterDiff === 'intermediate' && courseDiff === 'medium') return true;
        return courseDiff === filterDiff;
      })();

      // 3. Duration Filter
      const matchesDuration = (() => {
        if (selectedDuration === 'All hours') return true;
        
        const getCourseDurationInHours = (c) => {
          if (!c.duration) return 0;
          const val = parseFloat(c.duration);
          if (isNaN(val)) return 0;
          if (typeof c.duration === 'string' && c.duration.toLowerCase().includes('min')) {
            return val / 60;
          }
          if (val > 100) {
            return val / 60;
          }
          return val;
        };

        const duration = getCourseDurationInHours(item);
        if (selectedDuration === '0-2 hours') return duration >= 0 && duration <= 2;
        if (selectedDuration === '2-5 hours') return duration > 2 && duration <= 5;
        if (selectedDuration === '5-10 hours') return duration > 5 && duration <= 10;
        if (selectedDuration === '10-20 hours') return duration > 10 && duration <= 20;
        if (selectedDuration === '20+ hours') return duration > 20;
        return true;
      })();

      return matchesCategory && matchesDifficulty && matchesDuration;
    });
  }, [courses, activeFilter, selectedDifficulty, selectedDuration]);

  useEffect(() => {
    dispatch(fetchCourses())
    dispatch(fetchEvents({ status: 'active' })).finally(() => setHasFetchedEvents(true))
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      // 1. Hero Entrance
      gsap.from('.courses-hero > *', {
        y: 60, opacity: 0, filter: 'blur(15px)', stagger: 0.15, duration: 1.5, ease: 'expo.out'
      })

      // 2. Filter Row Entrance
      gsap.fromTo('.course-filter-reveal',
        { y: 30, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.2 }
      )

      // 3. Grid Entrance (ScrollTrigger)
      gsap.from('.course-grid > *', {
        scrollTrigger: { trigger: '.course-grid', start: 'top 85%' },
        y: 40, opacity: 0, filter: 'blur(10px)', stagger: 0.1, duration: 1.2, ease: 'power3.out'
      })

      // 4. Events Entrance (ScrollTrigger)
      gsap.from('.events-section > *', {
        scrollTrigger: { trigger: '.events-section', start: 'top 85%' },
        y: 40, opacity: 0, filter: 'blur(10px)', stagger: 0.2, duration: 1.2, ease: 'power3.out'
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const getImageUrl = (thumb) => {
    if (!thumb) return '/herocard.png'
    if (/^https?:\/\//i.test(thumb)) return thumb
    const baseUrl = 'https://api.edrilla.com'
    return thumb.startsWith('/') ? `${baseUrl}${thumb}` : `${baseUrl}/${thumb}`
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-dark pt-0 pb-24">

      {/* 1. Dynamic Hero Banner */}
      {eventList && eventList.length > 0 && <EventHero events={eventList} />}

      {/* 2. Page Content Wrapper */}
      <div className="px-4 md:px-12">
        <div className="courses-hero max-w-7xl mx-auto mb-0 pt-24">
          <h1 className="font-newsreader text-[clamp(4rem,10vw,8rem)] leading-tight font-extralight">
            {t('ourCourses')}
          </h1>
        </div>

        {/* 2. Filter Row Header (Replicating Screenshot Layout) */}
        <div className="max-w-7xl mx-auto mb-12">
          {/* Desktop Header Grid */}
          <div className="hidden md:grid grid-cols-12 items-end gap-12 w-full pb-8 border-b border-white/5">
            {/* Section 1: Filters (Cols 1-8) */}
            <div className="col-span-8 flex items-center gap-3">
              {['ALL COURSES', 'BUSINESS', 'DIGITAL MARKETING'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`course-filter-reveal opacity-0 px-6 py-3 font-montserrat text-[11px] font-bold tracking-[0.2em] border transition-all duration-500 uppercase ${activeFilter === filter
                    ? 'bg-accent text-dark border-accent'
                    : 'text-description border-white/10 hover:border-white/30 hover:text-normal'
                    }`}
                >
                  <RollingText text={filter} />
                </button>
              ))}
            </div>

            {/* Section 2: Info & More (Cols 9-12) */}
            <div className="col-span-4 flex flex-col items-end gap-10 course-filter-reveal opacity-0">
               <span className="font-montserrat text-[11px] text-description/80 uppercase tracking-[0.15em] font-bold">
                 {filteredCourses.length} COURSE{filteredCourses.length === 1 ? '' : 'S'} AVAILABLE
               </span>

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`flex items-center gap-3 font-montserrat text-[11px] text-description font-bold tracking-[0.2em] transition-colors group/filters ${showAdvanced ? 'text-accent' : 'hover:text-accent'}`}
              >
                <svg width="18" height="12" viewBox="0 0 24 16" fill="none" className={`transition-transform duration-500 ${showAdvanced ? 'rotate-180 scale-110' : 'group-hover/filters:scale-110'}`}>
                  <path d="M4 4H20M7 8H17M10 12H14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <RollingText text={showAdvanced ? "HIDE FILTERS" : "MORE FILTERS"} />
              </button>
            </div>
          </div>

          {/* Collapsible Advanced Filters Drawer */}
          <div
            ref={advancedRef}
            className={`overflow-hidden transition-all duration-700 ease-memo ${showAdvanced ? 'max-h-[600px] opacity-100 mt-12 mb-12' : 'max-h-0 opacity-0'}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 py-12 border-t border-white/5">
              {/* 1. Difficulty Section */}
              <div className="flex flex-col gap-8">
                <div className="flex items-center gap-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-accent">
                    <path d="M13 18L13 6M13 6L11 9M13 6L15 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 18L5 12M5 12L3 15M5 12L7 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 18L21 2M21 2L19 5M21 2L23 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h3 className="font-newsreader text-2xl italic text-normal">Difficulty</h3>
                </div>

                <div className="flex flex-wrap gap-3">
                  {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedDifficulty(level)}
                      className={`px-8 py-4 font-montserrat text-[11px] font-bold tracking-[0.2em] border transition-all duration-500 uppercase ${selectedDifficulty === level
                        ? 'bg-accent text-dark border-accent'
                        : 'text-description border-white/10 hover:border-white/20 hover:text-normal'
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Duration Section */}
              <div className="flex flex-col gap-8">
                <div className="flex items-center gap-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-accent">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h3 className="font-newsreader text-2xl italic text-normal">Duration</h3>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {['All hours', '0-2 hours', '2-5 hours', '5-10 hours', '10-20 hours', '20+ hours'].map((range) => (
                    <div
                      key={range}
                      onClick={() => setSelectedDuration(range)}
                      className="flex items-center gap-4 cursor-pointer group/dur"
                    >
                      <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${selectedDuration === range ? 'border-accent bg-accent/10' : 'border-white/10 group-hover/dur:border-white/30'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full bg-accent transition-transform duration-300 ${selectedDuration === range ? 'scale-100' : 'scale-0'
                          }`} />
                      </div>
                      <span className={`font-montserrat text-[11px] tracking-[0.1em] transition-colors ${selectedDuration === range ? 'text-normal font-bold' : 'text-description group-hover/dur:text-normal'
                        }`}>
                        {range}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <span className="font-jetbrains text-[8px] text-description/80 uppercase tracking-[0.2em] font-bold">
                {filteredCourses.length} COURSE{filteredCourses.length === 1 ? '' : 'S'} AVAILABLE
              </span>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`flex items-center gap-2 font-jetbrains text-[9px] font-bold tracking-[0.2em] transition-colors ${showAdvanced ? 'text-accent' : 'text-description hover:text-accent'}`}
              >
                <svg width="14" height="10" viewBox="0 0 24 16" fill="none" className={`transition-transform duration-500 ${showAdvanced ? 'rotate-180 scale-110' : ''}`}>
                  <path d="M4 4H20M7 8H17M10 12H14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                {showAdvanced ? "CLOSE" : "FILTERS"}
              </button>
            </div>

            <div className="relative group">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full flex items-center justify-between px-6 py-5 bg-white/5 border border-white/10 font-montserrat text-[11px] font-bold tracking-[0.2em]"
              >
                <span>CATEGORY: {activeFilter}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className={isFilterOpen ? 'rotate-180' : ''} stroke="currentColor">
                  <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {isFilterOpen && (
                <div className="absolute top-full left-0 w-full z-50 bg-[#0A0A0A] border-x border-b border-white/10">
                  {['ALL COURSES', 'BUSINESS', 'DIGITAL MARKETING'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => { setActiveFilter(filter); setIsFilterOpen(false); }}
                      className="w-full px-8 py-5 text-left font-montserrat text-[11px] border-b border-white/5 text-description hover:text-accent"
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Asymmetrical Masonry Grid */}
        <div className="course-grid max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 mb-12">
          {loading ? (
            <div className="col-span-full text-center py-20 text-accent font-montserrat">LOADING COURSES...</div>
          ) : error ? (
            <div className="col-span-full text-center py-20 text-red-500 font-montserrat">{t('failedToLoad')}</div>
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((item) => (
              <CourseCard
                key={item._id || item.id}
                item={{
                  id: item._id || item.id,
                  title: item.title,
                  category: item.category?.name || item.category || 'COURSE',
                  description: item.shortDescription || item.description,
                  price: item.salePrice ? `₹${item.salePrice}` : item.price ? `₹${item.price}` : 'FREE',
                  image: getImageUrl(item.thumbnail),
                  isNew: true,
                }}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-description font-montserrat">{t('noCoursesAvailable')}</div>
          )}
        </div>

        {/* 4. Upcoming Events Section */}
        <div className="events-section max-w-7xl mx-auto pt-24 border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="font-newsreader text-5xl md:text-6xl italic text-normal mb-4">Upcoming Events</h2>
              <p className="font-montserrat text-[11px] text-description uppercase tracking-[0.2em]">Curated experiences & intensive workshops.</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-jetbrains text-description">
              <span className="text-accent">•</span> <span>{t('berlin')}</span>
              <span className="text-accent">•</span> <span>{t('remotelyAvailable')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {eventsLoading ? (
              <div className="col-span-full text-center py-20 text-accent font-montserrat">LOADING EVENTS...</div>
            ) : eventList && eventList.length > 0 ? (
              eventList.map((event) => (
                <CourseCard
                  key={event._id || event.id}
                  item={{
                    id: event._id || event.id,
                    title: event.title,
                    category: event.category || 'EVENT',
                    description: event.description,
                    image: getImageUrl(event.thumbnail || event.image),
                    buttonText: event.buttonText || 'Register Now',
                    isNew: event.isNew
                  }}
                  variant="event"
                />
              ))
            ) : hasFetchedEvents ? (
              <div className="col-span-full text-center py-20 text-description font-montserrat uppercase tracking-widest">No upcoming events at the moment.</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses
