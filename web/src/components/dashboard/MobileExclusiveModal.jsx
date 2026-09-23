import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const MobileExclusiveModal = ({ isOpen, onClose }) => {
    const overlayRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            gsap.to(overlayRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out' });
            gsap.fromTo(contentRef.current, 
                { scale: 0.9, y: 30, opacity: 0 },
                { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' }
            );
        }
    }, [isOpen]);

    const handleClose = () => {
        gsap.to(contentRef.current, { scale: 0.9, y: 20, opacity: 0, duration: 0.3, ease: 'power2.in' });
        gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.4, ease: 'power2.in', onComplete: onClose });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6">
            {/* Backdrop */}
            <div 
                ref={overlayRef}
                onClick={handleClose}
                className="absolute inset-0 bg-dark/90 backdrop-blur-xl opacity-0"
            />
            
            {/* Modal Content */}
            <div 
                ref={contentRef}
                className="relative w-full max-w-md bg-[#0d0d0d] border border-white/[0.08] rounded-[2rem] p-10 md:p-14 text-center space-y-10 shadow-[0_50px_100px_rgba(0,0,0,0.9)] overflow-hidden opacity-0"
            >
                {/* Decorative Background Beam */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                
                {/* Icon Container */}
                <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl bg-accent/5 border border-accent/20 flex items-center justify-center mx-auto transition-transform duration-700 group-hover:rotate-12">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent/60 group-hover:text-accent transition-colors">
                            <path d="M22 17V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2z"/>
                            <path d="m15 15-6-6"/>
                            <path d="m9 15 6-6"/>
                            <path d="M12 19v3"/>
                            <path d="M9 22h6"/>
                        </svg>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <h2 className="font-newsreader italic text-3xl md:text-4xl text-normal font-extralight tracking-tight">
                        Mobile Exclusive <span className="text-accent">Content</span>
                    </h2>
                    <p className="font-jetbrains text-[11px] text-description/80 uppercase tracking-widest leading-[2]">
                        This tactical transmission is restricted to mobile architecture. 
                        <span className="block mt-2 text-accent/80 font-black decoration-accent/20 underline underline-offset-4">Download our app now to continue!</span>
                    </p>
                </div>

                {/* Actions */}
                <div className="space-y-6 pt-4">
                    <button className="w-full bg-accent text-dark py-5 rounded-2xl font-montserrat text-[14px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:scale-[1.03] active:scale-95 transition-all shadow-[0_15px_40px_rgba(139, 92, 246,0.15)] group/btn relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out skew-x-12" />
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                        Download App
                    </button>
                    
                    <button 
                        onClick={handleClose}
                        className="font-jetbrains text-[9px] text-description/30 uppercase tracking-[0.6em] hover:text-accent transition-colors font-black block mx-auto underline underline-offset-8 decoration-white/5 hover:decoration-accent/20"
                    >
                        Close Dispatch
                    </button>
                </div>

                {/* Security Tag */}
                <div className="pt-4 border-t border-white/5 opacity-20">
                    <p className="font-jetbrains text-[7px] uppercase tracking-[0.8em]">End of Transmission // Protocol 7-B</p>
                </div>
            </div>
        </div>
    );
};

export default MobileExclusiveModal;
