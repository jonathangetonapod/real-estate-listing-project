import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import WaitlistPage from './components/WaitlistPage'
import AppDashboard from './components/AppDashboard'
import AdminDashboard from './components/AdminDashboard'
import LoginPage from './components/LoginPage'
import SignUpPage from './components/SignUpPage'

function LandingPage() {
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/waitlist" element={<WaitlistPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/app" element={<AppDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
