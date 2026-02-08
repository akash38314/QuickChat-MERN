import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
// import Navbar from './components/Navbar' // Navbar Component ensure karein
import { Toaster } from "react-hot-toast"
import { AuthContext } from './context/AuthContext' 

const App = () => {
  // Destructure auth state from Context
  const { authUser, isCheckingAuth } = useContext(AuthContext);

  // Loading State: Jab tak backend se auth check ho raha hai
  if (isCheckingAuth && !authUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#1c1631]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/50 text-sm font-medium animate-pulse">Initializing QuickChat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1631] bg-[url('/bgImage.svg')] bg-contain text-white selection:bg-violet-500/30">
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#282142',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)'
          }
        }}
      />
      
      {/* Navbar Integration (Optional - logic preserved) */}
      {/* {authUser && <Navbar />} */}

      <Routes>
        {/* Home: Logged in users only */}
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />}/>
        
        {/* Auth: Guests only */}
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />}/>
        
        {/* Profile: Logged in users only */}
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />}/>
        
        {/* Fallback Route: Redirect unknown paths to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App;