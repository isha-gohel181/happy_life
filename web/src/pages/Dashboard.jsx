import React, { useEffect } from 'react'
import { gsap } from 'gsap'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import DashboardHero from '../components/dashboard/DashboardHero'
import WeeklyGoals from '../components/dashboard/WeeklyGoals'
import ContinueLearning from '../components/dashboard/ContinueLearning'
import RecentActivity from '../components/dashboard/RecentActivity'
import DashboardSidebar from '../components/dashboard/DashboardSidebar'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserProfile } from '../redux/slices/profileSlice'
import { fetchDashboardData } from '../redux/slices/dashboardSlice'
import DashboardLoading from '../components/dashboard/DashboardLoading'

const Dashboard = () => {
   const dispatch = useDispatch()
   const { loading } = useSelector(state => state.dashboard)

   useEffect(() => {
      dispatch(fetchUserProfile())
      dispatch(fetchDashboardData())
      window.scrollTo(0, 0)

      // Staggered reveal for dashboard modules
      gsap.from('.dash-reveal', {
         y: 20,
         duration: 1,
         stagger: 0.08,
         ease: 'power3.out',
         delay: 0.1
      })
   }, [])
   if (loading) return <DashboardLoading />

   return (
      <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900">
         <DashboardHeader />

         <main className="pt-24 pb-16 px-4 lg:px-8 max-w-[1600px] mx-auto relative z-10">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 auto-rows-min relative z-10">
               
               {/* TOP ROW: Hero & Goals */}
               <div className="dash-reveal lg:col-span-8 h-full">
                  <DashboardHero />
               </div>
               
               <div className="dash-reveal lg:col-span-4 h-full flex">
                  <div className="w-full h-full"><WeeklyGoals /></div>
               </div>

               {/* MIDDLE ROW: Continue Learning Banner (if available) */}
               <div className="dash-reveal lg:col-span-12">
                  <ContinueLearning />
               </div>

               {/* STATS & SIDEBAR SECTION: Full width */}
               <div className="dash-reveal lg:col-span-12">
                  <DashboardSidebar />
               </div>

               {/* BOTTOM ROW: Recent Activity */}
               <div className="dash-reveal lg:col-span-12 mt-2">
                  <RecentActivity />
               </div>

            </div>
         </main>

         {/* Floating Messenger */}
         <div className="fixed bottom-10 right-10 z-[100]">
            <button className="w-14 h-14 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center shadow-lg shadow-amber-400/20 hover:scale-110 active:scale-95 transition-all group border border-amber-300">
               <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-950">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
               </svg>
               <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
         </div>

      </div>
   )
}

export default Dashboard
