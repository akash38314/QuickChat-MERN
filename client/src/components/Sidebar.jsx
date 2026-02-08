import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
import { ChatContext } from '../context/ChatContext'; 

const Sidebar = () => {
    // Destructuring with default values for safety
    const { getUsers, users = [], selectedUser, setSelectedUser, unseenMessages = {}, setUnseenMessages } = useContext(ChatContext);
    const { logout, onlineUsers = [] } = useContext(AuthContext);

    const [searchTerm, setSearchTerm] = useState(""); 
    const navigate = useNavigate();

    // Memoized filter logic for performance
    const filteredUsers = users.filter((user) => 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        getUsers();
    }, [onlineUsers, getUsers]); 

    return (
        <div className={`bg-[#1c1631]/60 backdrop-blur-xl h-full p-5 border-r border-white/5 flex flex-col text-white transition-all duration-300 ${selectedUser ? "max-md:hidden" : 'w-full'}`}>
            
            {/* ------- Header with Glassmorphism Menu ------- */}
            <div className='flex justify-between items-center mb-6'>
                <img src={assets.logo} alt="logo" className='max-w-[110px] object-contain hover:scale-105 transition-transform' />
                <div className="relative py-2 group">
                    <div className='p-2 hover:bg-white/10 rounded-full cursor-pointer transition-colors'>
                        <img src={assets.menu_icon} alt="Menu" className='w-5 opacity-70 group-hover:opacity-100' />
                    </div>
                    
                    {/* Tooltip Menu */}
                    <div className='absolute top-full right-0 z-50 w-44 mt-2 p-2 rounded-2xl bg-[#282142]/95 backdrop-blur-2xl border border-white/10 shadow-2xl hidden group-hover:block animate-in fade-in zoom-in-95 duration-200'>
                        <button onClick={() => navigate('/profile')} className='w-full text-left p-3 hover:bg-white/5 rounded-xl cursor-pointer text-xs font-medium transition-colors flex items-center gap-2'>
                            <span>👤</span> Edit Profile
                        </button>
                        <hr className="my-1 border-white/5" />
                        <button onClick={() => logout()} className='w-full text-left p-3 hover:bg-red-500/10 text-red-400 rounded-xl cursor-pointer text-xs font-medium transition-colors flex items-center gap-2'>
                            <span>🚪</span> Logout Account
                        </button>
                    </div>
                </div>
            </div>

            {/* ------- Professional Search Bar ------- */}
            <div className='bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 py-3 px-4 mb-6 focus-within:ring-2 focus-within:ring-violet-500/30 transition-all'>
                <img src={assets.search_icon} alt="Search" className='w-4 opacity-40'/>
                <input 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    type="text" 
                    className='bg-transparent border-none outline-none text-white text-sm placeholder-gray-500 flex-1' 
                    placeholder='Find a friend...'
                />
            </div>

            {/* ------- Contact List ------- */}
            <div className='flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1'>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                        const isSelected = selectedUser?._id === user._id;
                        const isOnline = onlineUsers.includes(user._id);
                        const unseenCount = unseenMessages[user._id] || 0;
                        
                        return (
                            <div 
                                onClick={() => {
                                    setSelectedUser(user);
                                    if (unseenCount > 0) setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }));
                                }}
                                key={user._id} 
                                className={`group relative flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-200 
                                    ${isSelected ? 'bg-violet-600/30 border border-violet-500/20 shadow-lg shadow-violet-900/20' : 'bg-transparent border border-transparent hover:bg-white/5'}`}
                            >
                                {/* Avatar with Glow Online Status */}
                                <div className="relative flex-shrink-0">
                                    <img src={user?.profilePic || assets.avatar_icon} alt="" className={`w-12 h-12 rounded-full object-cover border-2 transition-all ${isSelected ? 'border-violet-400' : 'border-white/10'}`}/>
                                    {isOnline && (
                                        <span className='absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#1c1631] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]'></span>
                                    )}
                                </div>
                                
                                <div className='flex-1 min-w-0'>
                                    <div className='flex justify-between items-center mb-0.5'>
                                        <p className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-gray-200'}`}>{user.fullName}</p>
                                        {unseenCount > 0 && (
                                            <span className='flex-shrink-0 min-w-[18px] h-[18px] flex justify-center items-center rounded-full bg-violet-600 text-[10px] font-bold animate-bounce shadow-lg px-1'>
                                                {unseenCount}
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-[11px] font-medium ${isOnline ? 'text-green-400' : 'text-gray-500'}`}>
                                        {isOnline ? 'Active Now' : 'Last seen recently'}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center mt-10 opacity-30">
                        <span className="text-4xl mb-2">🔍</span>
                        <p className="text-xs">No users found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Sidebar;