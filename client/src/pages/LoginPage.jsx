import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../context/AuthContext' 

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext)

  const onSubmitHandler = (event) => {
    event.preventDefault();

    // 1. Multi-step signup logic
    if (currState === 'Sign up' && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    // 2. Auth Payload Taiyar karein
    const authPayload = currState === "Sign up" 
      ? { fullName, email, password, bio } 
      : { email, password };

    // 3. API call execute karein
    login(currState === "Sign up" ? 'signup' : 'login', authPayload);
  }

  return (
    <div className='min-h-screen bg-[#1c1631] bg-[url("/bgImage.svg")] bg-contain flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl px-4 transition-all duration-500'>
      
      {/* -------- Left: Branding -------- */}
      <div className='flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-700'>
        <img src={assets.logo_big} alt="logo" className='w-[min(35vw,280px)] animate-pulse' />
        <p className='text-gray-400 text-lg font-light hidden sm:block'>Connect with friends in real-time.</p>
      </div>

      {/* -------- Right: Auth Form -------- */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-10 flex flex-col gap-6 rounded-3xl shadow-2xl transition-all duration-500'>
        
        <div className='flex justify-between items-center mb-2'>
          <h2 className='font-bold text-3xl text-white tracking-tight'>{currState}</h2>
          {isDataSubmitted && (
            <button 
              type="button"
              onClick={() => setIsDataSubmitted(false)} 
              className='p-2 hover:bg-white/10 rounded-full transition-all group'
            >
              <img src={assets.arrow_icon} alt="back" className='w-6 invert opacity-70 group-hover:opacity-100 transition-opacity' />
            </button>
          )}
        </div>

        {/* Step 1: Login & Basic Signup */}
        {!isDataSubmitted && (
          <div className='flex flex-col gap-5 animate-in slide-in-from-left-5 duration-300'>
            {currState === "Sign up" && (
              <input onChange={(e) => setFullName(e.target.value)} value={fullName}
                type="text" className='p-4 bg-white/10 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-gray-500' placeholder="Full Name" required />
            )}
            <input onChange={(e) => setEmail(e.target.value)} value={email}
              type="email" placeholder='Email Address' required className='p-4 bg-white/10 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-gray-500' />
            <input onChange={(e) => setPassword(e.target.value)} value={password}
              type="password" placeholder='Password' required className='p-4 bg-white/10 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-gray-500' />
          </div>
        )}

        {/* Step 2: Signup Bio */}
        {currState === "Sign up" && isDataSubmitted && (
          <div className='flex flex-col gap-4 animate-in slide-in-from-right-10 duration-500'>
            <p className='text-gray-400 text-sm font-medium ml-1'>Tell us something interesting about yourself!</p>
            <textarea onChange={(e) => setBio(e.target.value)} value={bio}
              rows={4} className='p-4 bg-white/10 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none transition-all placeholder:text-gray-500' placeholder='Your bio...' required></textarea>
          </div>
        )}

        <button type='submit' className='py-4 mt-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-bold rounded-2xl cursor-pointer hover:shadow-lg hover:shadow-violet-500/40 transition-all active:scale-[0.98] shadow-xl'>
          {currState === "Sign up" ? (isDataSubmitted ? "Create Account" : "Next Step") : "Login Now"}
        </button>

        <div className='flex items-center gap-3 text-xs text-gray-500 ml-1'>
          <input type="checkbox" className='w-4 h-4 accent-violet-500 rounded cursor-pointer' required />
          <p>I agree to the <span className='text-violet-400 cursor-pointer hover:underline'>Terms</span> & <span className='text-violet-400 cursor-pointer hover:underline'>Privacy Policy</span>.</p>
        </div>

        <div className='border-t border-white/5 pt-6 mt-2'>
          <p className='text-sm text-gray-400 text-center'>
            {currState === "Sign up" ? "Already have an account?" : "Don't have an account?"}
            <span 
              onClick={() => { setCurrState(currState === "Sign up" ? "Login" : "Sign up"); setIsDataSubmitted(false) }} 
              className='font-bold text-violet-400 cursor-pointer hover:text-violet-300 transition-colors ml-2'
            >
              {currState === "Sign up" ? "Login here" : "Sign up now"}
            </span>
          </p>
        </div>
      </form>
    </div>
  )
}

export default LoginPage