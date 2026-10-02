import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses } from '../redux/slices/courseSlice'
import RollingText from '../components/RollingText'
import CourseCard from '../components/CourseCard'
import EventHero from '../components/EventHero'
import { fetchEvents } from '../redux/slices/eventSlice'
import { useLanguage } from '../context/LanguageContext'
import { dummyCourses, testSeriesData, buyBooksData } from '../data/coursesData'

const filterKeys = [
  { id: 'ALL COURSES', labelKey: 'allCoursesTab', defaultLabel: 'ALL COURSES' },
  { id: 'GS COURSES', labelKey: 'gsCoursesTab', defaultLabel: 'GS COURSES' },
  { id: 'OPTIONAL COURSES', labelKey: 'optionalCoursesTab', defaultLabel: 'OPTIONAL COURSES' },
  { id: 'TEST SERIES', labelKey: 'testSeriesTab', defaultLabel: 'TEST SERIES' },
  { id: 'BUY BOOKS', labelKey: 'buyBooksTab', defaultLabel: 'BUY BOOKS' }
]

const Courses = () => {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { courses, loading, error } = useSelector((state) => state.courses)
  const { eventList, loading: eventsLoading } = useSelector((state) => state.events)
  const containerRef = useRef(null)
  const { t } = useLanguage()

  // Determine initial filter from URL params
  const getInitialFilter = () => {
    const tabParam = searchParams.get('tab')
    const filterParam = searchParams.get('filter')
    const catParam = searchParams.get('category')

    if (tabParam === 'test-series' || filterParam === 'TEST SERIES') return 'TEST SERIES'
    if (tabParam === 'buy-books' || filterParam === 'BUY BOOKS') return 'BUY BOOKS'
    if (catParam === 'gs' || filterParam === 'GS COURSES') return 'GS COURSES'
    if (catParam === 'optional' || filterParam === 'OPTIONAL COURSES') return 'OPTIONAL COURSES'
    if (filterParam && filterKeys.some(f => f.id === filterParam)) return filterParam
    return 'ALL COURSES'
  }

  const [activeFilter, setActiveFilter] = useState(getInitialFilter)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedDuration, setSelectedDuration] = useState('All hours')
  const advancedRef = useRef(null)
  const [hasFetchedEvents, setHasFetchedEvents] = useState(false)

  // Modals for interactive experiences
  const [activeQuizModal, setActiveQuizModal] = useState(null)
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizTimer, setQuizTimer] = useState(0)

  const [activeBookModal, setActiveBookModal] = useState(null)
  const [isBookPurchased, setIsBookPurchased] = useState(false)
  const quizModalRef = useRef(null)
  const bookModalRef = useRef(null)

  // Prevent background Lenis scroll and enable automatic mouse/finger scrolling on modal open
  useEffect(() => {
    if (activeQuizModal || activeBookModal) {
      document.body.style.overflow = 'hidden'
      const timer = setTimeout(() => {
        if (quizModalRef.current) {
          quizModalRef.current.focus()
        } else if (bookModalRef.current) {
          bookModalRef.current.focus()
        }
      }, 50)
      return () => {
        clearTimeout(timer)
        document.body.style.overflow = ''
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [activeQuizModal, activeBookModal])

  // Sync activeFilter when searchParams change in URL
  useEffect(() => {
    const newFilter = getInitialFilter()
    setActiveFilter(newFilter)
  }, [searchParams])

  // Quiz timer
  useEffect(() => {
    let interval = null
    if (activeQuizModal && !quizSubmitted) {
      interval = setInterval(() => {
        setQuizTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [activeQuizModal, quizSubmitted])

  // Handle filter selection
  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId)
    setIsFilterOpen(false)
    if (filterId === 'TEST SERIES') {
      setSearchParams({ tab: 'test-series' })
    } else if (filterId === 'BUY BOOKS') {
      setSearchParams({ tab: 'buy-books' })
    } else if (filterId === 'GS COURSES') {
      setSearchParams({ filter: 'GS COURSES' })
    } else if (filterId === 'OPTIONAL COURSES') {
      setSearchParams({ filter: 'OPTIONAL COURSES' })
    } else {
      setSearchParams({})
    }
  }

  // Filter dynamic & fallback courses
  const filteredCourses = useMemo(() => {
    const apiAvailable = courses && courses.length > 0
    let listToFilter = apiAvailable ? courses : dummyCourses

    // If activeFilter is GS COURSES
    if (activeFilter === 'GS COURSES') {
      let gsResults = []
      if (apiAvailable) {
        gsResults = courses.filter(item => {
          const cat = (item.categoryId?.name || item.category?.name || item.category || '').toUpperCase()
          const title = (item.title || '').toUpperCase()
          const tags = Array.isArray(item.tags) ? item.tags.join(' ').toUpperCase() : ''
          return cat.includes('GS') || cat.includes('GENERAL STUDIES') || title.includes('GS') || tags.includes('GS')
        })
      }
      if (gsResults.length === 0) {
        gsResults = dummyCourses.filter(c => c.category === 'GS COURSES')
      }
      listToFilter = gsResults
    }

    // If activeFilter is OPTIONAL COURSES
    if (activeFilter === 'OPTIONAL COURSES') {
      let optResults = []
      if (apiAvailable) {
        optResults = courses.filter(item => {
          const cat = (item.categoryId?.name || item.category?.name || item.category || '').toUpperCase()
          const title = (item.title || '').toUpperCase()
          const tags = Array.isArray(item.tags) ? item.tags.join(' ').toUpperCase() : ''
          return cat.includes('OPTIONAL') || title.includes('OPTIONAL') || tags.includes('OPTIONAL')
        })
      }
      if (optResults.length === 0) {
        optResults = dummyCourses.filter(c => c.category === 'OPTIONAL COURSES')
      }
      listToFilter = optResults
    }

    return listToFilter.filter(item => {
      // Difficulty filter
      const matchesDifficulty = (() => {
        if (selectedDifficulty === 'All') return true
        const filterDiff = selectedDifficulty.toLowerCase()

        if (item.level && Array.isArray(item.level) && item.level.length > 0) {
          return item.level.some(l => l.toLowerCase() === filterDiff)
        }

        const courseDiff = (item.difficulty || '').toLowerCase()
        if (filterDiff === 'intermediate' && courseDiff === 'medium') return true
        return courseDiff === filterDiff
      })()

      // Duration filter
      const matchesDuration = (() => {
        if (selectedDuration === 'All hours') return true

        const getCourseDurationInHours = (c) => {
          if (!c.duration) return 0
          const val = parseFloat(c.duration)
          if (isNaN(val)) return 0
          if (typeof c.duration === 'string' && c.duration.toLowerCase().includes('min')) {
            return val / 60
          }
          if (val > 100) {
            return val / 60
          }
          return val
        }

        const duration = getCourseDurationInHours(item)
        if (selectedDuration === '0-2 hours') return duration >= 0 && duration <= 2
        if (selectedDuration === '2-5 hours') return duration > 2 && duration <= 5
        if (selectedDuration === '5-10 hours') return duration > 5 && duration <= 10
        if (selectedDuration === '10-20 hours') return duration > 10 && duration <= 20
        if (selectedDuration === '20+ hours') return duration > 20
        return true
      })()

      return matchesDifficulty && matchesDuration
    })
  }, [courses, activeFilter, selectedDifficulty, selectedDuration])

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
    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5000'
    return thumb.startsWith('/') ? `${baseUrl}${thumb}` : `${baseUrl}/${thumb}`
  }

  // Quiz Handling
  const startQuiz = (test) => {
    setActiveQuizModal(test)
    setCurrentQuizIndex(0)
    setSelectedAnswers({})
    setQuizSubmitted(false)
    setQuizTimer(0)
  }

  const handleSelectOption = (questionIndex, optionIndex) => {
    if (quizSubmitted) return
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }))
  }

  const calculateScore = () => {
    if (!activeQuizModal) return { score: 0, percentage: 0, total: 0 }
    let correctCount = 0
    activeQuizModal.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++
      }
    })
    const total = activeQuizModal.questions.length
    const percentage = Math.round((correctCount / total) * 100)
    return { score: correctCount, total, percentage }
  }

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Book Modal Handling
  const openBookModal = (book) => {
    setActiveBookModal(book)
    setIsBookPurchased(false)
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-dark pt-0 pb-24 text-normal">

      {/* 1. Dynamic Hero Banner */}
      {eventList && eventList.length > 0 && <EventHero events={eventList} />}

      {/* 2. Page Content Wrapper */}
      <div className="px-4 md:px-12 lg:px-20">
        
        {/* Hero Title */}
        <div className={`courses-hero max-w-7xl mx-auto mb-8 ${eventList && eventList.length > 0 ? 'pt-8' : 'pt-28 md:pt-36'}`}>
          <div className="flex items-baseline gap-6 flex-wrap">
            <h1 className="font-newsreader text-4xl md:text-6xl font-extralight italic text-normal tracking-tight">
              {t('ourCourses') || 'Our Courses'}
            </h1>
          </div>
          <p className="font-jetbrains text-xs text-accent uppercase tracking-[0.4em] font-bold italic mt-2">
            {t('coursesSubtitle') || 'Curated Academic Modules & Learning Tracks'}
          </p>
        </div>

        {/* ── Filter Row & Advanced Drawer ── */}
        <div className="max-w-7xl mx-auto mb-12">
          
          {/* Desktop Filter Row */}
          <div className="hidden md:grid grid-cols-12 items-end gap-12 w-full pb-8 border-b border-border">
            
            {/* Filter Buttons */}
            <div className="col-span-8 flex items-center flex-wrap gap-3">
              {filterKeys.map(({ id, labelKey, defaultLabel }) => {
                const isActive = activeFilter === id
                return (
                  <button
                    key={id}
                    onClick={() => handleFilterChange(id)}
                    className={`course-filter-reveal opacity-0 px-6 py-3 font-montserrat text-[11px] font-bold tracking-[0.2em] border transition-all duration-500 uppercase rounded-none cursor-pointer ${
                      isActive
                        ? 'bg-accent text-white border-accent'
                        : 'text-description border-border hover:border-accent/40 hover:text-normal'
                    }`}
                  >
                    <RollingText text={t(labelKey) || defaultLabel} />
                  </button>
                )
              })}
            </div>

            {/* Counter and Filter Toggle */}
            <div className="col-span-4 flex flex-col items-end gap-10 course-filter-reveal opacity-0">
              <span className="font-montserrat text-[11px] text-description/80 uppercase tracking-[0.15em] font-bold">
                {activeFilter === 'TEST SERIES'
                  ? `${testSeriesData.length} COURSES AVAILABLE`
                  : activeFilter === 'BUY BOOKS'
                  ? `${buyBooksData.length} COURSES AVAILABLE`
                  : `${filteredCourses.length} COURSES AVAILABLE`}
              </span>

              {activeFilter !== 'TEST SERIES' && activeFilter !== 'BUY BOOKS' && (
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-3 font-montserrat text-[11px] text-description font-bold tracking-[0.2em] transition-colors group/filters hover:text-accent cursor-pointer"
                >
                  <svg width="18" height="12" viewBox="0 0 24 16" fill="none" className="transition-transform duration-500 group-hover/filters:scale-110">
                    <path d="M4 4H20M7 8H17M10 12H14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <RollingText text={showAdvanced ? "HIDE FILTERS" : "MORE FILTERS"} />
                </button>
              )}
            </div>

          </div>

          {/* Collapsible Advanced Filters Drawer */}
          {activeFilter !== 'TEST SERIES' && activeFilter !== 'BUY BOOKS' && (
            <div
              ref={advancedRef}
              className={`overflow-hidden transition-all duration-700 ease-memo ${
                showAdvanced ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 py-12 border-t border-border">
                
                {/* 1. Difficulty */}
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
                        className={`px-8 py-4 font-montserrat text-[11px] font-bold tracking-[0.2em] border transition-all duration-500 uppercase rounded-none cursor-pointer ${
                          selectedDifficulty === level
                            ? 'bg-accent text-white border-accent'
                            : 'text-description border-border hover:border-accent/30 hover:text-normal'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Duration */}
                <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-4">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-accent">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
                      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h3 className="font-newsreader text-2xl italic text-normal">Duration</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {['All hours', '0-2 hours', '2-5 hours', '5-10 hours', '10-20 hours', '20+ hours'].map((range) => {
                      const isSelected = selectedDuration === range
                      return (
                        <div
                          key={range}
                          onClick={() => setSelectedDuration(range)}
                          className="flex items-center gap-4 cursor-pointer group/dur"
                        >
                          <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                            isSelected ? 'border-accent bg-accent/10' : 'border-border group-hover/dur:border-accent/40'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full bg-accent transition-transform duration-300 ${
                              isSelected ? 'scale-100' : 'scale-0'
                            }`}></div>
                          </div>
                          <span className={`font-montserrat text-[11px] tracking-[0.1em] transition-colors ${
                            isSelected ? 'text-normal font-bold' : 'text-description group-hover/dur:text-normal'
                          }`}>
                            {range}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Mobile Filter Header */}
          <div className="md:hidden flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <span className="font-jetbrains text-[8px] text-description/80 uppercase tracking-[0.2em] font-bold">
                {activeFilter === 'TEST SERIES'
                  ? `${testSeriesData.length} COURSES AVAILABLE`
                  : activeFilter === 'BUY BOOKS'
                  ? `${buyBooksData.length} COURSES AVAILABLE`
                  : `${filteredCourses.length} COURSES AVAILABLE`}
              </span>
              {activeFilter !== 'TEST SERIES' && activeFilter !== 'BUY BOOKS' && (
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 font-jetbrains text-[9px] font-bold tracking-[0.2em] transition-colors text-description hover:text-accent cursor-pointer"
                >
                  <svg width="14" height="10" viewBox="0 0 24 16" fill="none" className="transition-transform duration-500">
                    <path d="M4 4H20M7 8H17M10 12H14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  {showAdvanced ? "CLOSE" : "FILTERS"}
                </button>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full flex items-center justify-between px-6 py-5 bg-card border border-border font-montserrat text-[11px] font-bold tracking-[0.2em] text-normal cursor-pointer"
              >
                <span>CATEGORY: {filterKeys.find(f => f.id === activeFilter)?.defaultLabel || activeFilter}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180 text-accent' : ''}`} stroke="currentColor">
                  <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {isFilterOpen && (
                <div className="absolute top-full left-0 w-full mt-2 z-50 bg-card border border-border shadow-2xl divide-y divide-border">
                  {filterKeys.map(({ id, labelKey, defaultLabel }) => (
                    <button
                      key={id}
                      onClick={() => handleFilterChange(id)}
                      className={`w-full px-6 py-4 text-left font-montserrat text-[11px] font-bold tracking-[0.15em] uppercase transition-colors cursor-pointer ${
                        activeFilter === id ? 'bg-accent text-white' : 'text-description hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {t(labelKey) || defaultLabel}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* 3. Main Views Conditional Rendering */}

        {/* VIEW A: TEST SERIES (Quizzes & Mock Tests) */}
        {activeFilter === 'TEST SERIES' && (
          <div className="max-w-7xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testSeriesData.map((test) => (
                <div
                  key={test.id}
                  className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-xl hover:border-accent transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
                        {test.badge}
                      </span>
                      <span className="text-xs font-mono font-semibold text-description flex items-center gap-1">
                        ★ {test.rating} ({test.attempts})
                      </span>
                    </div>

                    <div>
                      <h3 className="font-newsreader text-2xl font-bold text-normal group-hover:text-accent transition-colors leading-snug">
                        {test.title}
                      </h3>
                      <p className="mt-2 text-xs text-description line-clamp-2 leading-relaxed">
                        {test.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-black/5 dark:bg-white/5 rounded-xl border border-border text-center">
                      <div>
                        <div className="text-[10px] text-description/60 font-medium">Questions</div>
                        <div className="text-xs font-mono font-bold text-normal">{test.questionsCount} Qs</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-description/60 font-medium">Time Limit</div>
                        <div className="text-xs font-mono font-bold text-normal">{test.durationMinutes} Mins</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-description/60 font-medium">Level</div>
                        <div className="text-xs font-mono font-bold text-accent">{test.difficulty}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => startQuiz(test)}
                      className="w-full py-3 px-4 rounded-none bg-accent text-white font-montserrat text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm active:scale-98 cursor-pointer"
                    >
                      <span>Start Test Series</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW B: BUY BOOKS (eBooks & Study Materials) */}
        {activeFilter === 'BUY BOOKS' && (
          <div className="max-w-7xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {buyBooksData.map((book) => (
                <div
                  key={book.id}
                  className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:border-accent transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Book Cover Banner */}
                    <div className="relative h-48 overflow-hidden bg-black/5 dark:bg-white/5">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-accent text-white shadow-sm">
                        {book.discount}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs">
                          {book.pages} Pages • {book.fileSize}
                        </span>
                        <span className="text-[10px] font-bold text-accent flex items-center gap-1">
                          ★ {book.rating} ({book.reviewsCount})
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent">
                        {book.category}
                      </div>
                      <h3 className="font-newsreader text-2xl font-bold text-normal group-hover:text-accent transition-colors leading-snug">
                        {book.title}
                      </h3>
                      <p className="text-[11px] text-description font-medium">By {book.author}</p>
                      <p className="text-xs text-description line-clamp-2 leading-relaxed">
                        {book.description}
                      </p>

                      <div className="pt-2 flex items-baseline gap-2">
                        <span className="text-xl font-bold text-normal font-newsreader">{book.price}</span>
                        <span className="text-xs text-description/60 line-through font-mono">{book.originalPrice}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex gap-2.5">
                    <button
                      onClick={() => openBookModal(book)}
                      className="flex-1 py-2.5 px-3 rounded-none border border-border text-normal font-montserrat text-xs font-bold uppercase tracking-wider hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-center"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => openBookModal(book)}
                      className="flex-1 py-2.5 px-3 rounded-none bg-accent text-white font-montserrat text-xs font-bold uppercase tracking-wider hover:scale-[1.02] active:scale-98 transition-all shadow-xs cursor-pointer text-center"
                    >
                      Get eBook
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW C: COURSES GRID (All Courses, GS Courses, Optional Courses) */}
        {activeFilter !== 'TEST SERIES' && activeFilter !== 'BUY BOOKS' && (
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
                    category: item.categoryId?.name || item.category?.name || item.category || 'COURSE',
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
        )}

        {/* 4. Upcoming Events Section */}
        <div className="events-section max-w-7xl mx-auto pt-24 border-t border-border">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="font-newsreader text-5xl md:text-6xl italic text-normal mb-4">Upcoming Events</h2>
              <p className="font-montserrat text-[11px] text-description uppercase tracking-[0.2em]">Curated experiences & intensive workshops.</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-jetbrains text-description">
              <span className="text-accent">•</span> <span>{t('berlin') || 'BERLIN'}</span>
              <span className="text-accent">•</span> <span>{t('remotelyAvailable') || 'REMOTELY AVAILABLE'}</span>
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

      {/* 5. INTERACTIVE QUIZ MODAL (Test Series) */}
      {activeQuizModal && (
        <div
          data-lenis-prevent="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveQuizModal(null)
          }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto overscroll-contain"
        >
          <div
            ref={quizModalRef}
            tabIndex={-1}
            data-lenis-prevent="true"
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto overscroll-contain outline-none focus:outline-none my-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md uppercase">
                  {activeQuizModal.category}
                </span>
                <h3 className="font-newsreader text-2xl font-bold text-slate-900 mt-2">{activeQuizModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveQuizModal(null)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {!quizSubmitted ? (
              <div className="space-y-6">
                {/* Progress & Timer */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span>Question {currentQuizIndex + 1} of {activeQuizModal.questions.length}</span>
                  <span className="font-bold text-amber-800 flex items-center gap-1.5">
                    <span>⏱️</span> {formatTimer(quizTimer)}
                  </span>
                </div>

                {/* Question */}
                <div className="space-y-4">
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {activeQuizModal.questions[currentQuizIndex].question}
                  </h4>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {activeQuizModal.questions[currentQuizIndex].options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[currentQuizIndex] === optIdx
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(currentQuizIndex, optIdx)}
                          className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-medium border transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                            isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Footer Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    disabled={currentQuizIndex === 0}
                    onClick={() => setCurrentQuizIndex((p) => Math.max(0, p - 1))}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    ← Previous
                  </button>

                  {currentQuizIndex < activeQuizModal.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuizIndex((p) => p + 1)}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-accent hover:text-slate-950 transition-colors cursor-pointer"
                    >
                      Next Question →
                    </button>
                  ) : (
                    <button
                      onClick={() => setQuizSubmitted(true)}
                      className="px-6 py-2.5 rounded-xl bg-accent text-slate-950 text-xs font-black uppercase tracking-wider hover:scale-105 transition-transform shadow-md cursor-pointer"
                    >
                      Submit Test
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Quiz Result Review */
              <div className="space-y-6">
                <div className="text-center py-6 bg-amber-50 rounded-2xl border border-amber-200/80 space-y-2">
                  <div className="text-3xl">🎯</div>
                  <h4 className="text-2xl font-bold font-newsreader text-slate-900">
                    Your Score: {calculateScore().score} / {calculateScore().total}
                  </h4>
                  <p className="text-sm font-mono font-bold text-amber-800">
                    Accuracy: {calculateScore().percentage}% • Time: {formatTimer(quizTimer)}
                  </p>
                </div>

                {/* Explanations List */}
                <div data-lenis-prevent="true" className="space-y-4 max-h-72 overflow-y-auto overscroll-contain pr-2">
                  {activeQuizModal.questions.map((q, idx) => {
                    const isCorrect = selectedAnswers[idx] === q.correctIndex
                    return (
                      <div key={idx} className={`p-4 rounded-xl border text-xs space-y-2 ${isCorrect ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'}`}>
                        <div className="flex items-center justify-between font-bold">
                          <span>Q{idx + 1}: {q.question}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            {isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                          </span>
                        </div>
                        <p className="text-slate-600">
                          <span className="font-bold text-slate-800">Correct Answer:</span> {q.options[q.correctIndex]}
                        </p>
                        <p className="text-[11px] text-slate-500 bg-white/70 p-2.5 rounded-lg border border-slate-200/60">
                          💡 <span className="font-bold">Explanation:</span> {q.explanation}
                        </p>
                      </div>
                    )
                  })}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setCurrentQuizIndex(0)
                      setSelectedAnswers({})
                      setQuizSubmitted(false)
                      setQuizTimer(0)
                    }}
                    className="flex-1 py-3 rounded-xl border border-slate-300 font-inter text-xs font-bold uppercase hover:bg-slate-50 cursor-pointer"
                  >
                    Retake Test
                  </button>
                  <button
                    onClick={() => setActiveQuizModal(null)}
                    className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-inter text-xs font-bold uppercase hover:bg-accent hover:text-slate-950 cursor-pointer transition-colors"
                  >
                    Close Results
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. BOOK DETAILS & PREVIEW MODAL (Buy Books) */}
      {activeBookModal && (
        <div
          data-lenis-prevent="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveBookModal(null)
          }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto overscroll-contain"
        >
          <div
            ref={bookModalRef}
            tabIndex={-1}
            data-lenis-prevent="true"
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto overscroll-contain outline-none focus:outline-none my-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md uppercase">
                  {activeBookModal.category} • {activeBookModal.format}
                </span>
                <h3 className="font-newsreader text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{activeBookModal.title}</h3>
                <p className="text-xs text-slate-500">By {activeBookModal.author}</p>
              </div>
              <button
                onClick={() => setActiveBookModal(null)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-5">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {activeBookModal.description}
              </p>

              {/* Highlights */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Book Highlights & Key Topics</h5>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {activeBookModal.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sample Excerpt */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-1.5">
                <div className="text-[10px] font-mono font-bold uppercase text-amber-900 tracking-wider">Sample Chapter Excerpt</div>
                <p className="text-xs italic text-slate-800 leading-relaxed font-newsreader">
                  "{activeBookModal.sampleExcerpt}"
                </p>
              </div>

              {/* Price & Buy CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Special Launch Price</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900 font-newsreader">{activeBookModal.price}</span>
                    <span className="text-xs text-slate-400 line-through font-mono">{activeBookModal.originalPrice}</span>
                    <span className="text-xs font-bold text-emerald-600 font-mono">{activeBookModal.discount}</span>
                  </div>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  {!isBookPurchased ? (
                    <button
                      onClick={() => setIsBookPurchased(true)}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-accent text-slate-950 font-inter text-xs font-black uppercase tracking-wider hover:scale-105 transition-transform shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Buy & Download eBook</span>
                      <span>→</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                      <span>✓ Order Confirmed! Download link ready.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Courses
