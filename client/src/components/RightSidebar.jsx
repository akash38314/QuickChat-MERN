import React, { useEffect, useState } from 'react';
import assets from '../assets/assets'; 
import { useChat } from '../context/ChatContext'; 
import { useAuth } from '../context/AuthContext';

const RightSidebar = () => {
    const { selectedUser, messages, logout } = useChat(); 
    const { onlineUsers } = useAuth();
    const [msgImages, setMsgImages] = useState([]);

    useEffect(() => {
        if (messages && Array.isArray(messages)) {
            const images = messages.filter(msg => msg.image).map(msg => msg.image);
            setMsgImages(images);
        }
    }, [messages]);

    if (!selectedUser) return null;

    return (
        <div className="bg-black/20 backdrop-blur-md text-white w-full h-full flex flex-col border-l border-white/5 overflow-y-auto">
            <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light px-4'>
                <div className='relative'>
                    <img src={selectedUser?.profilePic || "/avatar.png"} className='w-24 h-24 rounded-full object-cover border-2 border-violet-500/50' alt="" />
                    {onlineUsers?.includes(selectedUser._id) && (
                        <span className='absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#1c1631]'></span>
                    )}
                </div>
                <h1 className='text-xl font-medium mt-2'>{selectedUser.fullName}</h1>
                <p className='text-gray-400 text-center italic px-4'>{selectedUser.bio || "Hey there!"}</p>
            </div>

            <hr className="border-white/10 my-8 mx-6"/>

            <div className="px-5 flex-1 overflow-y-auto custom-scrollbar">
                <p className="text-sm font-medium text-gray-300 mb-4">Shared Media ({msgImages.length})</p>
                <div className='grid grid-cols-3 gap-2 pb-10'>
                    {msgImages.map((url, index) => (
                        <div key={index} className='aspect-square rounded-lg overflow-hidden border border-white/10'>
                            <img src={url} alt="" className='w-full h-full object-cover'/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default RightSidebar;