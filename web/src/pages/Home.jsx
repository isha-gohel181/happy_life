import Hero from '../components/Hero'
import AboutSnapshot from '../components/AboutSnapshot'
import LogoMarquee from '../components/LogoMarquee'
import EventHero from '../components/EventHero'
import StackingBanners from '../components/StackingBanners'
import GrowthSection from '../components/GrowthSection'
import BrandFeatures from '../components/BrandFeatures'
import { eventData } from '../constants/events'
import CourseSlider from '../components/CourseSlider'
import FreeContentSection from '../components/FreeContentSection'

const Home = ({ isLoaded }) => {
  return (
    <div className="w-full">
      <Hero isLoaded={isLoaded} />
      <AboutSnapshot />
      <CourseSlider />
      <FreeContentSection />

      {/* Dynamic Event Showcase */}
      {/* <EventHero events={eventData} /> */}
      
      <LogoMarquee />
      <StackingBanners />
      <BrandFeatures />
      <GrowthSection />
    </div>
  )
}

export default Home
