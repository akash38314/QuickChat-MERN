import React, { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../context/ChatContext' 

const HomePage = () => {
    const { selectedUser } = useContext(ChatContext);

    return (
        // Fixed: Added overflow-hidden to body container to prevent scroll bounce
        <div className='h-screen w-full bg-[#1c1631] flex items-center justify-center p-0 sm:p-4 lg:p-8 overflow-hidden'>
            
            <div className='w-full max-w-[1600px] h-full max-h-[900px] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex relative'>
                
                {/* 1. Sidebar - Refined Mobile Logic */}
                <aside className={`flex-[0.3] min-w-[300px] md:min-w-[350px] border-r border-white/5 bg-black/10 transition-all duration-300 
                    ${selectedUser ? "max-md:hidden" : "w-full"}`}>
                    <Sidebar />
                </aside>

                {/* 2. Main Chat Area */}
                <main className={`flex-1 flex flex-col transition-all duration-300
                    ${!selectedUser ? "max-md:hidden" : "w-full"}`}>
                    {selectedUser ? (
                        <ChatContainer />
                    ) : (
                        /* Empty State - Added 'select-none' for cleaner UI */
                        <div className='hidden md:flex flex-col items-center justify-center h-full text-center p-10 opacity-40 select-none'>
                            <div className='w-20 h-20 bg-violet-500/20 rounded-full flex items-center justify-center mb-4 animate-bounce'>
                                <span className='text-3xl'>💬</span>
                            </div>
                            <h2 className='text-white text-xl font-semibold mb-2'>Welcome to QuickChat</h2>
                            <p className='text-gray-400 text-sm max-w-xs'>Select a friend to start a real-time conversation.</p>
                        </div>
                    )}
                </main>

                {/* 3. Right Profile Sidebar */}
                {selectedUser && (
                    <aside className='w-[300px] xl:w-[350px] border-l border-white/5 max-lg:hidden animate-in fade-in slide-in-from-right-10 duration-500'>
                        <RightSidebar />
                    </aside>
                )}
            </div>
        </div>
    )
}

export default HomePage;