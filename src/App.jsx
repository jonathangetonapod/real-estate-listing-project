import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
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

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-light-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="font-heading text-3xl font-bold text-charcoal">Off</span>
          <span className="font-heading text-3xl font-bold text-orange">Market</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-orange" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="font-sans text-sm text-gray-400">Loading...</span>
        </div>
      </div>
    </div>
  )
}

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, profile, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" />
  if (requireAdmin && profile?.role !== 'admin') return <Navigate to="/app" />

  return children
}

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
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/waitlist" element={<WaitlistPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/app" element={
            <ProtectedRoute>
              <AppDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
