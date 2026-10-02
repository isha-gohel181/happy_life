import Hero from '../components/Hero'
import CourseSlider from '../components/CourseSlider'
import LogoMarquee from '../components/LogoMarquee'
import EventHero from '../components/EventHero'
import StackingBanners from '../components/StackingBanners'
import GrowthSection from '../components/GrowthSection'
import BrandFeatures from '../components/BrandFeatures'
import { eventData } from '../constants/events'

const Home = ({ isLoaded }) => {
  return (
    <div className="w-full">
      <Hero isLoaded={isLoaded} />
      <CourseSlider />

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
