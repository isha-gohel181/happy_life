import React from 'react'
import sanitizeDisplay from '../utils/textSanitize'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const CourseCard = ({ item, className = '', variant = 'course' }) => {
  const { t } = useLanguage()

  const CardContent = (
    <div className={`catalog-card bg-white border border-slate-200/80 hover:border-amber-400 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col h-full group relative overflow-hidden ${className}`}>
      {/* Image Wrapper */}
      <div className="relative overflow-hidden mb-6 aspect-[16/10] bg-slate-100 rounded-xl shrink-0">
        <img 
          src={item.image} 
          alt={sanitizeDisplay(item.title)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {item.isNew && (
          <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 px-2.5 py-0.5 font-jetbrains text-[9px] font-black tracking-wider rounded-md shadow-sm z-10">
            {t('newBadge')}
          </div>
        )}
      </div>

      {/* Content Metadata */}
      <div className="flex flex-col flex-grow gap-3">
        <span className="font-jetbrains text-[10px] text-amber-800 tracking-[0.25em] font-black uppercase">
          {item.category}
        </span>
        
        <h3 className="font-newsreader text-2xl md:text-[26px] text-slate-900 group-hover:text-amber-600 transition-colors duration-300 font-bold tracking-tight leading-tight line-clamp-2">
          {sanitizeDisplay(item.title)}
        </h3>
        
        <p className="font-montserrat text-xs text-slate-600 leading-relaxed mb-4 flex-grow line-clamp-2 font-medium">
          {item.description}
        </p>

        {/* Card Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
          {variant === 'course' ? (
            <>
              <span className="font-montserrat text-sm text-slate-900 tracking-wider font-extrabold">
                {item.price}
              </span>
              <div className="w-9 h-9 flex items-center justify-center border border-amber-300 bg-amber-50 group-hover:bg-accent group-hover:border-accent rounded-full transition-all duration-300 shadow-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-300 stroke-amber-800 group-hover:stroke-slate-950">
                  <path d="M7 17L17 7M17 7H7M17 7V17" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </>
          ) : (
            <button className="w-full py-3.5 bg-accent text-slate-950 rounded-full font-jetbrains text-xs font-black tracking-[0.25em] uppercase hover:scale-[1.02] shadow-accent-soft transition-all duration-300">
              {item.buttonText || t('registerNow')}
            </button>
          )}
        </div>
      </div>
    </div>
  )

  if (variant === 'course') {
    return (
      <Link to={`/course-detail/${item.id}`} className="block h-full">
        {CardContent}
      </Link>
    )
  }

  return CardContent
}

export default CourseCard
