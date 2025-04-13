
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Index from './pages/Index'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import Network from './pages/Network'
import Sessions from './pages/Sessions'
import Explore from './pages/Explore'
import Messages from './pages/Messages'
import UserSkillsSelection from './pages/UserSkillsSelection'
import HowItWorks from './pages/HowItWorks'
import Settings from './pages/Settings'
import Notifications from './pages/Notifications'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'sonner'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/network" element={<Network />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/skills-selection" element={<UserSkillsSelection />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </AuthProvider>
  )
}

export default App
