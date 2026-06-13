import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Landing from './pages/Landing/Landing'
import Auth from './pages/Auth/Auth'
import Dashboard from './pages/Dashboard/Dashboard'
import Resume from './pages/Resume/Resume'
import './App.css'
import Pricing from './pages/Pricing/Pricing'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import NotFound from './pages/NotFound/NotFound'
/* import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3' */


function App() {
  return (
    /*  <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}> */
       <BrowserRouter>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <Navbar />

    <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/pricing" element={<Pricing />} />
        

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/resume" element={
          <ProtectedRoute>
            <Resume />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
    </Routes>
    </BrowserRouter>
   /*  </GoogleReCaptchaProvider> */
  )
}

export default App