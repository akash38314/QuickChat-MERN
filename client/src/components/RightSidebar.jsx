import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets'; 
import { ChatContext } from '../context/ChatContext'; 
import { AuthContext } from '../context/AuthContext';

const RightSidebar = () => {
    // Context se data nikalna
    const { selectedUser, messages } = useContext(ChatContext);
    const { logout, onlineUsers } = useContext(AuthContext);
    const [msgImages, setMsgImages] = useState([]);

    // Messages se images nikalne ka logic
    useEffect(() => {
        if (messages && Array.isArray(messages)) {
            const images = messages.filter(msg => msg.image).map(msg => msg.image);
            setMsgImages(images);
        }
    }, [messages]);

    // Agar user select nahi hai toh render nahi karna
    if (!selectedUser) return null;

    return (
        <div className={`bg-black/20 text-white w-full h-full flex flex-col relative border-l border-white/5 overflow-y-auto ${selectedUser ? "max-md:hidden" : ""}`}>
            
            {/* ------- User Info Section ------- */}
            <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light px-4'>
                <img 
                    src={selectedUser?.profilePic || assets.avatar_icon} 
                    alt="profile"
                    className='w-24 h-24 rounded-full object-cover border-2 border-violet-500/50 p-1' 
                />
                <h1 className='text-xl font-medium flex items-center gap-2 mt-2'>
                    {selectedUser.fullName}
                    {onlineUsers?.includes(selectedUser._id) && (
                        <span className='w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'></span>
                    )}
                </h1>
                <p className='text-gray-400 text-center italic px-4'>
                    {selectedUser.bio || "Hey there! I am using QuickChat."}
                </p>
            </div>

            <hr className="border-white/10 my-6 mx-5"/>

            {/* ------- Media Gallery Section ------- */}
            <div className="px-5 flex-1">
                <p className="text-sm font-medium mb-4 text-gray-300">Shared Media</p>
                {msgImages.length > 0 ? (
                    <div className='grid grid-cols-3 gap-2 pb-24'>
                        {msgImages.map((url, index) => (
                            <div 
                                key={index} 
                                onClick={() => window.open(url)} 
                                className='aspect-square cursor-pointer hover:scale-105 transition-all duration-200 rounded-lg overflow-hidden border border-white/10 shadow-lg'
                            >
                                <img src={url} alt="shared" className='w-full h-full object-cover'/>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4 text-[10px]">No media shared yet</p>
                )}
            </div>

            {/* ------- Logout Button ------- */}
            <div className="p-5 mt-auto">
                <button 
                    onClick={() => logout()} 
                    className='w-full bg-gradient-to-r from-red-500/80 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white text-sm font-medium py-3 rounded-xl transition-all shadow-lg active:scale-95'
                >
                    Logout Account
                </button>
            </div>
        </div>
    );
};

export default RightSidebar;