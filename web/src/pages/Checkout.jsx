import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { gsap } from 'gsap'
import { fetchSettings, validateCoupon, clearCoupon, fetchAllCoupons } from '../redux/slices/configSlice'
import { buyNow } from '../redux/slices/enrollmentSlice'
import bannerImg from '../assets/images/banner.png'
import CheckoutBreakdown from '../components/CheckoutBreakdown'
import { useLanguage } from '../context/LanguageContext'

const Checkout = () => {
   const navigate = useNavigate()
   const location = useLocation()
   const dispatch = useDispatch()
   const { t } = useLanguage()

   const searchParams = new URLSearchParams(location.search)
   const urlCourseId = searchParams.get('course_id')
   const urlPlanId = searchParams.get('plan_id')
   const urlAcc = searchParams.get('acc')
   const urlAmount = searchParams.get('amount')

   const selectedPlan = location.state?.plan || (urlPlanId ? { id: urlPlanId, title: 'Selected Plan', price: urlAmount ? Number(urlAmount) : 3499 } : { id: '1year', title: '1 Year', price: 3499 })
   const course = location.state?.course || (urlCourseId ? { id: urlCourseId, _id: urlCourseId, title: 'Course Purchase' } : {})
   const accParam = urlAcc || location.state?.acc || ''

   const { settings, coupons, couponData, couponError, couponLoading } = useSelector(state => state.config)
   const authUser = useSelector(state => state.auth?.user)

   const rawBase = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE || 'https://happy-life-sx03.onrender.com';
   const BASE_API = rawBase.replace(/\/api\/v1\/?$/, '');

   const [formData, setFormData] = useState(() => {
      let savedUser = null;
      try {
         const lsUser = localStorage.getItem('user') || localStorage.getItem('userInfo');
         if (lsUser) {
            savedUser = JSON.parse(lsUser);
         }
      } catch (e) {
         console.error('Error parsing user from localstorage', e);
      }

      return {
         fullName: savedUser?.name || savedUser?.fullName || '',
         email: savedUser?.email || '',
         phone: savedUser?.phone || savedUser?.mobile || '',
         company: (savedUser && (savedUser.company?.name || (typeof savedUser.company === 'string' ? savedUser.company : ''))) || '',
         gst: savedUser?.gst || '',
         coupon: ''
      };
   });

   // If user is logged in via Redux, prefill any empty fields (don't overwrite user-typed values)
   useEffect(() => {
      if (!authUser) return;
      setFormData(prev => ({
         ...prev,
         fullName: prev.fullName || authUser.name || authUser.fullName || '',
         email: prev.email || authUser.email || '',
         phone: prev.phone || authUser.phone || authUser.mobile || '',
         company: prev.company || (authUser.company?.name ?? (typeof authUser.company === 'string' ? authUser.company : '')) || '',
         gst: prev.gst || (authUser.company && authUser.company.gstNumber) || prev.gst || ''
      }))
   }, [authUser])
   const [displayTotal, setDisplayTotal] = useState(0)
   const [isVerified, setIsVerified] = useState(false)
   const [showOTPModal, setShowOTPModal] = useState(false)
   const [otp, setOtp] = useState('')
   const [sendingOtp, setSendingOtp] = useState(false)
   const [verifyingOtp, setVerifyingOtp] = useState(false)
   const [otpMessage, setOtpMessage] = useState('')
   const [showSuccessModal, setShowSuccessModal] = useState(false)
   const checkoutRef = useRef(null)
   const leftWingRef = useRef(null)
   const rightWingRef = useRef(null)
   const scanLineRef = useRef(null)

   const basePrice = selectedPlan.price
   const gstRate = Number(settings?.gstRate ?? 0.18)
   const discount = couponData ? (couponData.discountType === 'percentage' ? (basePrice * couponData.discountPercent / 100) : couponData.discountAmount) : 0
   const discountedBase = Math.max(0, basePrice - discount)
   const gstAmount = discountedBase * gstRate
   const total = discountedBase + gstAmount
   const formatCurrency = (v) => `₹${Number(v || 0).toFixed(2)}`

   useEffect(() => {
      window.scrollTo(0, 0)
      dispatch(fetchSettings())
      dispatch(fetchAllCoupons())
      dispatch(clearCoupon())

      const ctx = gsap.context(() => {
         // Entrance and loop animations remain the same...
         const tl = gsap.timeline()
         tl.from(leftWingRef.current, { xPercent: -100, duration: 1.5, ease: 'expo.inOut' })
            .from(rightWingRef.current, { xPercent: 100, duration: 1.5, ease: 'expo.inOut' }, '-=1.5')
            .from('.protocol-reveal', { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }, '-=0.5')

         gsap.to(scanLineRef.current, { top: '100%', duration: 3, repeat: -1, ease: 'none' })

         const countObj = { val: 0 }
         gsap.to(countObj, {
            val: total,
            duration: 2,
            delay: 1,
            ease: 'power3.out',
            onUpdate: () => setDisplayTotal(countObj.val.toFixed(2))
         })
      }, checkoutRef)

      return () => ctx.revert()
   }, [total, dispatch])

   // Load Razorpay script dynamically
   const loadRazorpayScript = () => new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve(true)
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => reject(new Error('Razorpay SDK failed to load'))
      document.body.appendChild(script)
   })

   const handlePayment = async () => {
      try {
         await loadRazorpayScript()
      } catch (e) {
         // eslint-disable-next-line no-console
         console.error('Razorpay SDK load error', e)
         alert('Payment SDK failed to load')
         return
      }
      // Validate / create order on backend before opening Razorpay
      try {
         const payload = {
            courseId: course._id || course.id || '',
            guestEmail: formData.email,
            guestName: formData.fullName,
            couponCode: formData.coupon || '',
            is_verify: Boolean(isVerified),
            coursePlanId: selectedPlan.id || selectedPlan._id || ''
         }

         if (accParam) payload.acc = accParam;

         const chkRes = await fetch(`${BASE_API}/checkout/check-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
         })
         const chkData = await chkRes.json()
         if (!chkRes.ok) {
            alert(chkData?.message || 'Order validation failed')
            return
         }

         if (!chkData?.success || !chkData?.is_valid) {
            alert(chkData?.data?.message || 'Order cannot be placed')
            return
         }

         // Use returned razorpay details if present
         const razor = chkData?.razorpay || {}
         const rKey = razor.key || settings?.RAZORPAY_KEY_ID || settings?.settings?.RAZORPAY_KEY_ID
         const order = razor.order || {}
         const rAmount = (order.amount != null) ? order.amount : Math.round(total * 100)

         const options = {
            key: rKey,
            amount: rAmount, // amount in paise expected
            currency: razor.currency || 'INR',
            name: selectedPlan.title || 'Bankers Grade',
            description: course.title || 'Course Purchase',
            order_id: order.id,
            handler: async function (response) {
               // eslint-disable-next-line no-console
               console.log('Razorpay success', response)

               try {
                  // Dispatch buyNow to finalize enrollment on backend
                  const buyPayload = {
                     courseId: course._id || course.id || '',
                     paymentId: response.razorpay_payment_id,
                     orderId: response.razorpay_order_id,
                     signature: response.razorpay_signature,
                     guestEmail: formData.email,
                     guestName: formData.fullName,
                     paymentProvider: 'razorpay',
                     coursePlanId: selectedPlan.id || selectedPlan._id || '',
                     couponCode: formData.coupon || '',
                     company: formData.company,
                     gst: formData.gst
                  }

                  if (accParam) buyPayload.acc = accParam;

                  const resultAction = await dispatch(buyNow(buyPayload)).unwrap()

                  // On success (201 is handled by thunk success)
                  setShowSuccessModal(true)

               } catch (error) {
                  // eslint-disable-next-line no-console
                  console.error('Finalization failed', error)
                  alert(error || 'Payment succeeded but enrollment failed. Please contact support.')
               }
            },
            prefill: {
               name: formData.fullName,
               email: formData.email,
               contact: formData.phone
            },
            notes: {
               courseId: course._id || '',
               planId: selectedPlan.id || ''
            },
            theme: { color: '#8B5CF6' }
         }

         const rzp = new window.Razorpay(options)
         rzp.open()
      } catch (err) {
         // eslint-disable-next-line no-console
         console.error('Order check failed', err)
         alert(err?.message || 'Order creation failed')
      }
   }

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });

      // Auto-validate if it's the coupon dropdown
      if (name === 'coupon' && value) {
         dispatch(validateCoupon(value));
      } else if (name === 'coupon' && !value) {
         dispatch(clearCoupon());
      }
   }

   const handleApplyCoupon = () => {
      if (formData.coupon) {
         dispatch(validateCoupon(formData.coupon))
      }
   }

   // Keep track of verified status from auth or localStorage
   useEffect(() => {
      const localUser = (() => {
         try {
            return JSON.parse(localStorage.getItem('edrilla_user') || '{}')
         } catch { return {} }
      })()
      const verified = Boolean(
         authUser?.isVerified || authUser?.verified || authUser?.emailVerified ||
         localUser?.isVerified || localUser?.verified || localUser?.emailVerified
      )
      setIsVerified(verified)
   }, [authUser])

   const sendOtp = async () => {
      if (!formData.email) {
         setOtpMessage('Please enter an email to verify')
         return
      }
      setSendingOtp(true)
      setOtpMessage('')
      try {
         const res = await fetch(`${BASE_API}/sendotp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email })
         })
         const data = await res.json()
         if (!res.ok) throw new Error(data?.message || 'Failed to send OTP')
         // If backend reports the email is already verified, mark verified and don't open modal
         if (data?.is_verify) {
            setIsVerified(true)
            // Ignore backend message when already verified to avoid showing "OTP sent" text
            setOtpMessage('Already verified')
            setShowOTPModal(false)
         } else {
            setOtpMessage(data?.message || 'OTP sent — check your email')
            setShowOTPModal(true)
         }
      } catch (err) {
         setOtpMessage(err.message || 'Network error')
      } finally {
         setSendingOtp(false)
      }
   }

   const verifyOtp = async () => {
      if (!otp) {
         setOtpMessage('Enter the OTP')
         return
      }
      setVerifyingOtp(true)
      setOtpMessage('')
      try {
         const res = await fetch(`${BASE_API}/verifyotp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email, otp })
         })
         const data = await res.json()
         if (!res.ok) throw new Error(data?.message || 'OTP verification failed')
         // Mark verified locally — backend may return updated user object
         setIsVerified(true)
         // If backend returned updated user, persist it
         if (data?.data?.user) {
            try { localStorage.setItem('edrilla_user', JSON.stringify(data.data.user)) } catch { }
         }
         setOtpMessage('Email verified')
         setShowOTPModal(false)
         setOtp('')
      } catch (err) {
         setOtpMessage(err.message || 'Verification failed')
      } finally {
         setVerifyingOtp(false)
      }
   }

   return (
      <div ref={checkoutRef} className="min-h-screen bg-dark flex flex-col lg:flex-row relative selection:bg-accent/40 selection:text-white">

         {/* GLOBAL BACK BUTTON */}
         <button
            onClick={() => navigate(-1)}
            className="fixed top-4 left-4 sm:top-10 sm:left-10 z-50 flex items-center gap-3 group px-4 py-2 bg-dark/40 backdrop-blur-md border border-white/10 hover:border-accent transition-all duration-500"
         >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-accent stroke-accent group-hover:-translate-x-1 transition-transform">
               <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-jetbrains text-[9px] text-normal/60 group-hover:text-accent tracking-[0.3em] font-black uppercase">Return to Archive</span>
         </button>
         <div ref={leftWingRef} className="lg:w-[45%] h-[65vh] min-h-[520px] lg:h-screen lg:sticky top-0 bg-black overflow-hidden relative border-r border-white/5">

            {/* Course Banner Wrap */}
            <div className="absolute inset-0 opacity-100 group">
               <img src={bannerImg} alt="Course Banner" className="w-full h-full object-cover scale-110 animate-pulse-slow" />
               <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
               <div className="absolute inset-0 bg-gradient-to-b from-dark/20 via-transparent to-dark" />
            </div>

            {/* Cinematic Scanning Overlay */}
            <div ref={scanLineRef} className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent z-10 opacity-40 shadow-[0_0_15px_rgba(139, 92, 246,0.5)]" />
            <div className="absolute inset-0 pointer-events-none z-10 p-6 sm:p-12 flex flex-col justify-between">

               {/* Top Identity Block */}
               <div className="space-y-4 sm:space-y-6">
                  <div className="flex gap-4 items-center opacity-40">
                     <span className="font-jetbrains text-[8px] tracking-[0.5em] uppercase font-black">System Identity</span>
                     <div className="h-[1px] w-24 bg-white/20" />
                     <span className="font-jetbrains text-[8px] tracking-[0.3em] uppercase">VGD-0044-ACTV</span>
                  </div>
                  {authUser?.company?.name && (
                     <div className="mt-2">
                        <span className="font-jetbrains text-[10px] text-normal/60 uppercase tracking-[0.2em]">{authUser.company.name}</span>
                     </div>
                  )}

                  <h2 className="font-newsreader italic text-[clamp(2.5rem,5vw,4.5rem)] text-normal leading-tight font-extralight tracking-tighter">
                     MVP <br /> Engineering.
                  </h2>

                  <div className="inline-flex items-center gap-3 bg-accent/5 border border-accent/20 px-6 py-2">
                     <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                     <span className="font-jetbrains text-[9px] text-accent tracking-[0.2em] font-black uppercase">PROTOCOL ACTIVE</span>
                  </div>
               </div>

               {/* Bottom Total Block */}
               <div className="space-y-6 sm:space-y-10">
                  <div className="space-y-4">
                     <p className="font-montserrat text-[14px] text-description uppercase tracking-[0.5em] font-black">Activation Total</p>
                     <div className="flex items-baseline gap-4">
                        <span className="font-newsreader italic text-[clamp(3rem,8vw,7rem)] text-accent tracking-tighter leading-none drop-shadow-[0_0_20px_rgba(139, 92, 246,0.3)]">
                           ₹{displayTotal}
                        </span>
                        <span className="font-jetbrains text-xs text-accent/40 mb-4">INR</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 max-w-sm pt-6 sm:pt-8 border-t border-white/10">
                     <div className="hidden sm:block">
                        <CheckoutBreakdown
                           compact
                           basePrice={basePrice}
                           discount={discount}
                           gstRate={gstRate}
                           couponData={couponData}
                           className="mt-8"
                        />
                     </div>
                     <div className="sm:col-span-1">
                        <p className="font-jetbrains text-[7px] text-description/80 uppercase tracking-[0.3em] mb-3">Access Tier</p>
                        <p className="font-jetbrains text-[9px] text-normal uppercase tracking-widest leading-none font-black">{selectedPlan.title} PERSISTENCE</p>
                     </div>
                  </div>
               </div>

               {/* Corner Brackets */}
               <div className="absolute top-4 left-4 sm:top-8 sm:left-8 w-6 h-6 border-l border-t border-white/20" />
               <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-6 h-6 border-r border-t border-white/20" />
               <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-6 h-6 border-l border-b border-white/20" />
               <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-6 h-6 border-r border-b border-white/20" />
            </div>
         </div>

         {/* -------------------- RIGHT WING: SCROLLABLE FORM -------------------- */}
         <div ref={rightWingRef} className="lg:flex-1 bg-dark pt-8 md:pt-14 px-6">
            {/* <div ref={rightWingRef} className="lg:flex-1 bg-dark pt-32 lg:pt-52 pb-32 px-6 md:px-20 lg:px-24"> */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-start scroll-mt-24">
               <div className="lg:col-span-2 space-y-12 lg:space-y-24">

                  {/* Protocol Head */}
                  <div className="space-y-4 protocol-reveal">
                     <h1 className="font-newsreader italic text-6xl text-normal font-extralight tracking-tighter">Activation Form.</h1>
                     <div className="w-16 h-[1px] bg-accent" />
                  </div>

                  <form className="space-y-10 lg:space-y-16">

                     {/* 01: IDENTITY IDENTIFIER */}
                     <div className="space-y-10 protocol-reveal">
                        <div className="flex items-center gap-6 group">
                           <span className="font-montserrat text-[14px] text-accent font-black border border-accent/30 w-10 h-10 flex items-center justify-center rounded-full group-hover:bg-accent group-hover:text-dark transition-all duration-500">01</span>
                           <h3 className="font-newsreader italic text-3xl text-normal">Carrier Identity</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="font-jetbrains text-[9px] text-normal/40 uppercase tracking-[0.4em] mb-2 font-black">Full Legal Identity</label>
                              <input
                                 type="text" name="fullName" placeholder={t('enterName')}
                                 value={formData.fullName}
                                 className="w-full bg-white/[0.03] border border-white/10 p-7 font-jetbrains text-xs text-normal focus:border-accent focus:bg-white/[0.05] transition-all outline-none focus:ring-1 focus:ring-accent/40"
                                 onChange={handleChange}
                              />
                              <div className="mt-3 flex items-center gap-3">
                                 {isVerified ? (
                                    <span className="text-green-400 font-jetbrains text-xs uppercase tracking-wider">Verified</span>
                                 ) : (
                                    <button
                                       type="button"
                                       onClick={sendOtp}
                                       disabled={sendingOtp || !formData.email}
                                       className={`px-4 py-2 text-sm font-jetbrains border rounded ${sendingOtp || !formData.email ? 'opacity-50 cursor-not-allowed' : 'bg-accent text-dark'}`}
                                    >
                                       {sendingOtp ? 'Sending...' : 'Verify Email'}
                                    </button>
                                 )}
                                 {otpMessage && <span className="text-[11px] text-normal/70">{otpMessage}</span>}
                              </div>






                           </div>
                           <div className="space-y-3">
                              <label className="font-jetbrains text-[9px] text-normal/40 uppercase tracking-[0.4em] font-black">Digital Dispatch (Email)</label>
                              <input
                                 type="email" name="email" placeholder="EMAIL@PROTOCOL.ARCH"
                                 value={formData.email}
                                 disabled={isVerified}
                                 className={`w-full bg-white/[0.03] border border-white/10 p-7 font-jetbrains text-xs text-normal focus:border-accent focus:bg-white/[0.05] transition-all outline-none focus:ring-1 focus:ring-accent/40 ${isVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
                                 onChange={handleChange}
                              />
                           </div>
                        </div>
                     </div>

                     {/* 02: COMMS & ENTITY */}
                     <div className="space-y-10 protocol-reveal">
                        <div className="flex items-center gap-6 group">
                           <span className="font-montserrat text-[14px] text-accent font-black border border-accent/30 w-10 h-10 flex items-center justify-center rounded-full group-hover:bg-accent group-hover:text-dark transition-all duration-500">02</span>
                           <h3 className="font-newsreader italic text-3xl text-normal">Comms & Business</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="font-jetbrains text-[9px] text-normal/40 uppercase tracking-[0.4em] font-black">Signal Connection (Phone)</label>
                              <div className="flex">
                                 <div className="bg-accent/10 border border-white/10 border-r-0 p-7 font-jetbrains text-xs text-accent">+91</div>
                                 <input
                                    type="tel" name="phone" placeholder={t('phoneNumber')}
                                    value={formData.phone}
                                    className="flex-1 bg-white/[0.03] border border-white/10 p-7 font-jetbrains text-xs text-normal focus:border-accent outline-none transition-all"
                                    onChange={handleChange}
                                 />
                              </div>
                           </div>
                           <div className="space-y-3">
                              <label className="font-jetbrains text-[9px] text-normal/40 uppercase tracking-[0.4em] font-black">Commercial Agency</label>
                              <input
                                 type="text" name="company" placeholder="BRAND / FIRM"
                                 value={formData.company}
                                 className="w-full bg-white/[0.03] border border-white/10 p-7 font-jetbrains text-xs text-normal focus:border-accent outline-none transition-all"
                                 onChange={handleChange}
                              />
                           </div>
                        </div>
                     </div>

                     {/* 03: TAX & INCENTIVES */}
                     <div className="space-y-10 protocol-reveal">
                        <div className="flex items-center gap-6 group">
                           <span className="font-montserrat text-[14px] text-accent font-black border border-accent/30 w-10 h-10 flex items-center justify-center rounded-full group-hover:bg-accent group-hover:text-dark transition-all duration-500">03</span>
                           <h3 className="font-newsreader italic text-3xl text-normal">Tax Codes & Coupons</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="font-jetbrains text-[9px] text-normal/40 uppercase tracking-[0.4em] font-black">GST Identifier</label>
                              <input
                                 type="text" name="gst" placeholder="GSTN"
                                 value={formData.gst}
                                 className="w-full bg-white/[0.03] border border-white/10 p-7 font-jetbrains text-xs text-normal focus:border-accent outline-none transition-all"
                                 onChange={handleChange}
                              />
                           </div>
                           <div className="space-y-3">
                              <label className="font-jetbrains text-[9px] text-normal/40 uppercase tracking-[0.4em] font-black">Promotional Dispatch</label>
                              <div className="flex gap-2">
                                 <select
                                    name="coupon"
                                    className="flex-1 bg-white/[0.03] border border-white/10 p-7 font-jetbrains text-xs text-normal focus:border-accent outline-none transition-all appearance-none"
                                    onChange={handleChange}
                                    value={formData.coupon}
                                 >
                                    <option value="" className="bg-dark text-normal/40">SELECT COUPON</option>
                                    {Array.isArray(coupons) && coupons.map(c => (
                                       <option key={c._id} value={c.code} className="bg-dark text-normal">
                                          {c.code} - {c.discountType === 'percentage' ? `${c.discountPercent}% OFF` : `₹${c.discountAmount} OFF`}
                                       </option>
                                    ))}
                                 </select>
                                 <button
                                    type="button"
                                    onClick={handleApplyCoupon}
                                    disabled={couponLoading || !formData.coupon}
                                    className={`bg-accent/15 border border-accent/30 px-8 font-jetbrains text-[9px] text-accent font-black uppercase hover:bg-accent hover:text-dark transition-all duration-500 ${(couponLoading || !formData.coupon) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                 >
                                    {couponLoading ? 'Verifying...' : 'Apply'}
                                 </button>
                              </div>
                              {couponError && <p className="font-jetbrains text-[8px] text-red-500 uppercase tracking-widest mt-2">{couponError}</p>}
                              {couponData && <p className="font-jetbrains text-[8px] text-accent uppercase tracking-widest mt-2">Protocol Applied: -₹{discount}</p>}
                           </div>
                        </div>
                     </div>

                     {/* COMPLETE ACTIVATION CTA */}
                     <div className="pt-10 protocol-reveal grid gap-4">

                        <button onClick={handlePayment} type="button" className="w-full group relative bg-accent py-9 flex items-center justify-center gap-6 hover:scale-[1.01] active:scale-[0.98] transition-all duration-700 overflow-hidden shadow-[0_0_30px_rgba(139, 92, 246,0.1)]">
                           <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
                           <span className="relative z-10 font-jetbrains text-dark text-sm font-black tracking-[0.8em] uppercase">Pay Now</span>
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="relative z-10 text-dark stroke-dark group-hover:translate-x-3 transition-transform duration-700">
                              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="4" />
                           </svg>
                        </button>

                        <div className="mt-6">
                           <div className="mt-2 flex justify-between items-center opacity-30 px-2">
                              <p className="font-jetbrains text-[8px] uppercase tracking-[0.4em]">SSL ENCRYPTED 256-BIT</p>
                              <p className="font-jetbrains text-[8px] uppercase tracking-[0.4em]">Activation Protocol v1.4</p>
                           </div>
                        </div>
                     </div>

                  </form>

                  {/* Mobile: show breakdown lower on small screens (placed after form) */}
                  <div className="lg:hidden mt-8 px-2">
                     <CheckoutBreakdown
                        basePrice={basePrice}
                        discount={discount}
                        gstRate={gstRate}
                        couponData={couponData}
                     />
                     <div className="mt-4 text-center">
                        <div className="text-sm text-normal/70">Quick total</div>
                        <div className="font-newsreader italic text-2xl text-accent mt-1">{formatCurrency(total)}</div>
                     </div>
                  </div>

               </div>

               {/* RIGHT SIDEBAR: sticky breakdown */}
               <aside className="hidden lg:block lg:col-span-1">
                  <div className="sticky top-28">
                     <CheckoutBreakdown
                        basePrice={basePrice}
                        discount={discount}
                        gstRate={gstRate}
                        couponData={couponData}
                     />
                     <div className="mt-6 p-4 text-center">
                        <div className="text-sm text-normal/70">Quick total</div>
                        <div className="font-newsreader italic text-3xl text-accent mt-2">{formatCurrency(total)}</div>
                     </div>
                  </div>
               </aside>
            </div>
         </div>

         {showOTPModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
               <div className="bg-dark p-6 rounded max-w-sm w-full">
                  <h3 className="font-newsreader text-xl text-normal mb-4">Verify OTP</h3>
                  <p className="text-sm text-normal/70 mb-2">Enter the OTP sent to {formData.email}</p>
                  <input
                     value={otp}
                     onChange={e => setOtp(e.target.value)}
                     placeholder="Enter OTP"
                     className="w-full p-3 bg-white/[0.03] border border-white/10 mb-4 font-jetbrains text-sm"
                  />
                  <div className="flex gap-3 justify-end">
                     <button type="button" onClick={() => { setShowOTPModal(false); setOtp(''); setOtpMessage('') }} className="px-4 py-2 border">Cancel</button>
                     <button type="button" onClick={verifyOtp} disabled={verifyingOtp} className={`px-4 py-2 bg-accent text-dark ${verifyingOtp ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {verifyingOtp ? 'Verifying...' : 'Verify'}
                     </button>
                  </div>
                  {otpMessage && <p className="mt-3 text-sm text-normal/70">{otpMessage}</p>}
               </div>
            </div>
         )}

         {/* SUCCESS MODAL */}
         {showSuccessModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
               <div className="bg-dark border border-accent/20 p-8 md:p-12 max-w-lg w-full relative overflow-hidden shadow-[0_0_50px_rgba(139, 92, 246,0.15)] group">
                  {/* Decorative background elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                     {/* Success Icon */}
                     <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center border border-accent/30 relative">
                        <div className="absolute inset-0 rounded-full border border-accent animate-ping opacity-20" />
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-accent stroke-accent">
                           <path d="M20 6L9 17l-5-5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                     </div>

                     <div className="space-y-2">
                        <p className="font-jetbrains text-[10px] text-accent uppercase tracking-[0.4em] font-black">Transaction Verified</p>
                        <h3 className="font-newsreader italic text-3xl md:text-4xl text-normal tracking-tight">Activation Complete.</h3>
                        <p className="font-jetbrains text-[11px] text-normal/60 uppercase tracking-widest mt-2">
                           Your credentials are now securely bound to the system.
                        </p>
                     </div>

                     {/* CTA */}
                     <button
                        onClick={() => navigate('/dashboard/my-courses')}
                        className="mt-4 w-full bg-accent text-dark py-5 font-jetbrains text-xs font-black uppercase tracking-[0.4em] hover:scale-[1.02] transition-transform duration-300 flex justify-center items-center gap-3"
                     >
                        Enter Dashboard
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                           <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                     </button>
                  </div>

                  {/* Border accents */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent/20" />
               </div>
            </div>
         )}

      </div>
   )
}

export default Checkout
