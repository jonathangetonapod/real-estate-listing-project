import Navbar from './components/Navbar'
import Hero from './components/Hero'
import VideoPlaceholder from './components/VideoPlaceholder'
import DashboardMockup from './components/DashboardMockup'
import StatStrip from './components/StatStrip'
import ProblemSection from './components/ProblemSection'
import HowItWorks from './components/HowItWorks'
import AIComparison from './components/AIComparison'
import LeadTypes from './components/LeadTypes'
import Pricing from './components/Pricing'
import FAQ from './components/FAQ'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <VideoPlaceholder />
        <DashboardMockup />
        <StatStrip />
        <ProblemSection />
        <HowItWorks />
        <AIComparison />
        <LeadTypes />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}

export default App
