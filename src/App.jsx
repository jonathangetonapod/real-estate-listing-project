import WaitlistPage from './components/WaitlistPage'

// Pre-launch: show waitlist page
// Post-launch: swap back to full landing page (components still exist)
function App() {
  return <WaitlistPage />
}

export default App
