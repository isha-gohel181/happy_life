import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

const RollingText = ({ text = "", className = "", stagger = 0.02 }) => {
  const containerRef = useRef(null)
  
  // Use unique refs for each layer to avoid conflict
  const primaryRef = useRef(null)
  const secondaryRef = useRef(null)

  useEffect(() => {
    const primaryChars = primaryRef.current.querySelectorAll('.shutter-char')
    const secondaryChars = secondaryRef.current.querySelectorAll('.shutter-char')
    
    const tl = gsap.timeline({ paused: true })
    
    tl.to(primaryChars, { 
      y: '-100%', 
      duration: 0.4, 
      ease: 'power3.inOut', 
      stagger: stagger 
    })
    tl.to(secondaryChars, { 
      y: '-100%', 
      duration: 0.4, 
      ease: 'power3.inOut', 
      stagger: stagger 
    }, 0)

    const handleMouseEnter = () => tl.play()
    const handleMouseLeave = () => tl.reverse()

    // Attach to the closest parent interactive element if possible, or itself
    const target = containerRef.current.closest('button, a, .rolling-target') || containerRef.current
    
    target.addEventListener('mouseenter', handleMouseEnter)
    target.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      target.removeEventListener('mouseenter', handleMouseEnter)
      target.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [text, stagger])

  // Handle Grapheme Clusters for Hindi & Devanagari Unicode
  const getGraphemes = (str) => {
    if (!str) return []
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      try {
        const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
        return Array.from(segmenter.segment(str), s => s.segment)
      } catch (e) {
        // Fallthrough
      }
    }
    return str.match(/[\u0900-\u097F][\u0900-\u094F\u0962-\u0963]*|[^\u0900-\u097F]/gu) || str.split('')
  }

  const chars = getGraphemes(text)

  return (
    <div ref={containerRef} className={`shutter-row relative overflow-hidden ${className}`}>
      <div ref={primaryRef} className="shutter-layer shutter-primary flex">
        {chars.map((char, i) => (
          <span key={i} className="shutter-char inline-block">{char === ' ' ? '\u00A0' : char}</span>
        ))}
      </div>
      <div ref={secondaryRef} className="shutter-layer shutter-secondary flex absolute top-full left-0">
        {chars.map((char, i) => (
          <span key={i} className="shutter-char inline-block">{char === ' ' ? '\u00A0' : char}</span>
        ))}
      </div>
    </div>
  )
}

export default RollingText
