import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const CreateTopicModal = ({ isOpen, onClose, onSubmit }) => {
  const modalRef = useRef(null)
  const overlayRef = useRef(null)
  const contentRef = useRef(null)
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [attachments, setAttachments] = useState([])
  
  const fileInputRef = useRef(null)
  
  const tags = ['Mindset', 'Feedback', 'PaidAds', 'SEO', 'ClientAcquisition', 'Operations', 'Troubleshooting']

  useEffect(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out' })
      gsap.fromTo(contentRef.current, 
        { scale: 0.95, y: 20, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.2)' }
      )
    }
  }, [isOpen])

  const handleClose = () => {
    gsap.to(contentRef.current, { scale: 0.95, y: 20, opacity: 0, duration: 0.3, ease: 'power2.in' })
    gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.4, ease: 'power2.in', onComplete: onClose })
  }

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
        setSelectedTags(selectedTags.filter(t => t !== tag))
    } else if (selectedTags.length < 5) {
        setSelectedTags([...selectedTags, tag])
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || isSubmitting) return
    
    setIsSubmitting(true)
    try {
      const result = await onSubmit({
        title,
        content,
        tags: selectedTags,
        attachments
      })
      
      if (result) {
        setIsSubmitting(false)
        handleClose()
        // Reset form after closing
        setTimeout(() => {
          setTitle('')
          setContent('')
          setSelectedTags([])
          setAttachments([])
        }, 400)
      } else {
        setIsSubmitting(false)
      }
    } catch (error) {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div ref={modalRef} className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8 overflow-y-auto py-20">
      {/* Backdrop Overlay */}
      <div 
        ref={overlayRef}
        onClick={handleClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm opacity-0 pointer-events-none"
      />
      
      {/* Modal Content container */}
      <div 
        ref={contentRef}
        className="relative w-full max-w-3xl h-[95vh] bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl opacity-0 flex flex-col"
      >
        {/* Header Terminal */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-100">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-jetbrains text-slate-950 text-sm font-black">
                 AS
              </div>
              <span className="font-newsreader italic text-lg text-slate-900">Anshul</span>
           </div>
            <button 
              onClick={handleClose}
              className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all duration-300 md:w-10 md:h-10"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
           </button>
        </div>

        {/* Intelligence Form Area */}
        <div className="flex-1 p-6 md:px-10 md:py-14 space-y-12 overflow-y-auto custom-scrollbar" data-lenis-prevent>
           
           {/* Section: Title Input */}
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                 <span className="font-jetbrains text-[9px] font-black text-amber-700 tracking-[0.3em] uppercase">Title <span className="text-red-500">*</span></span>
              </div>
              <div className="relative group">
                 <input 
                   type="text" 
                   value={title}
                   onChange={(e) => setTitle(e.target.value.substring(0, 100))}
                   placeholder="e.g., Why is my useEffect running twice?"
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-5 font-jetbrains text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 transition-all"
                 />
                 <span className="absolute right-4 top-1/2 -translate-y-1/2 font-jetbrains text-[8px] text-slate-400 uppercase tracking-widest">{title.length}/100</span>
              </div>
           </div>

           {/* Section: Content Editor */}
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                 <span className="font-jetbrains text-[9px] font-black text-amber-700 tracking-[0.3em] uppercase">Content <span className="text-red-500">*</span></span>
              </div>
              <div className="relative group">
                 <textarea 
                   value={content}
                   onChange={(e) => setContent(e.target.value.substring(0, 2000))}
                   placeholder="Describe your question or topic in detail..."
                   className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-6 font-jetbrains text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 transition-all min-h-[180px] resize-none"
                 />
                 <span className="absolute right-4 bottom-4 font-jetbrains text-[8px] text-slate-400 uppercase tracking-widest">{content.length}/2000</span>
              </div>
           </div>

           {/* Section: Dynamic Tags Selector */}
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                 <span className="font-jetbrains text-[9px] font-black text-amber-700 tracking-[0.3em] uppercase">Tags <span className="text-slate-500 font-normal ml-2 italic">(Select up to 5)</span></span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                 {tags.map((tag) => (
                    <button 
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 border font-jetbrains text-[8px] font-bold uppercase tracking-widest transition-all duration-300 rounded-full
                        ${selectedTags.includes(tag) ? 'bg-accent border-amber-400 text-slate-950 font-black shadow-sm' : 'border-slate-200 text-slate-700 hover:border-amber-400 hover:text-slate-900 bg-white'}`}
                    >
                       #{tag}
                    </button>
                 ))}
              </div>
           </div>

           {/* Section: File Attachment Protocol */}
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                 <span className="font-jetbrains text-[9px] font-black text-amber-700 tracking-[0.3em] uppercase">Attachments <span className="text-slate-500 font-normal ml-2 italic">(Optional)</span></span>
              </div>

              <input 
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files)
                  setAttachments([...attachments, ...newFiles])
                }}
                multiple
                className="hidden"
              />

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-slate-100/50 transition-colors"
              >
                 <div className="w-12 h-12 rounded-full flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform duration-500 bg-amber-50">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                    <span className="font-montserrat text-[14px] font-black uppercase tracking-widest text-slate-900">Click to upload files or drag and drop</span>
                    <span className="font-jetbrains text-[8px] text-slate-500 uppercase tracking-widest font-medium">Images, PDFs, Documents (Max 10MB each)</span>
                 </div>
              </div>

              {/* Selected Files List */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-3 px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl group/file">
                      <span className="font-jetbrains text-[10px] text-slate-800 truncate max-w-[150px]">{file.name}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setAttachments(attachments.filter((_, i) => i !== idx))
                        }}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
           </div>
        </div>

        {/* Footer Terminal Actions */}
        <div className="flex-shrink-0 p-4 border-t border-slate-100 flex items-center justify-end gap-6">
            <button 
              onClick={handleClose}
              className="font-jetbrains text-[11px] font-bold text-slate-600 hover:text-slate-900 uppercase tracking-[0.4em] transition-colors py-4 px-2"
            >
               Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim() || isSubmitting}
              className="bg-accent text-slate-950 font-black px-10 py-5 font-montserrat text-[11px] uppercase tracking-[0.4em] flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-accent-soft disabled:opacity-50 disabled:grayscale min-w-[200px] justify-center rounded-full"
            >
               {isSubmitting ? (
                 <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
               ) : (
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
               )}
               {isSubmitting ? 'Creating...' : 'Create Topic'}
            </button>
         </div>
      </div>
    </div>
  )
}

export default CreateTopicModal;
