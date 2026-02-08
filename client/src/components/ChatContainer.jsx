import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../context/ChatContext' // Fixed Path
import { AuthContext } from '../context/AuthContext' // Fixed Path
import toast from 'react-hot-toast'

const ChatContainer = () => {
    const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext)
    const { authUser, onlineUsers } = useContext(AuthContext)
    const scrollEnd = useRef()
    const [input, setInput] = useState('');

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === "") return;
        await sendMessage({ text: input.trim() });
        setInput("")
    }

    const handleSendImage = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            toast.error("Please select an image file")
            return;
        }
        const reader = new FileReader();
        reader.onloadend = async () => {
            await sendMessage({ image: reader.result })
            e.target.value = ""
        }
        reader.readAsDataURL(file)
    }

    useEffect(() => {
        if (selectedUser) getMessages(selectedUser._id)
    }, [selectedUser])

    useEffect(() => {
        if (scrollEnd.current && messages) {
            scrollEnd.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    return selectedUser ? (
        <div className='flex flex-col h-full bg-[#1c1631]/20 backdrop-blur-xl relative'>
            {/* ------- Header ------- */}
            <div className='flex items-center gap-3 p-4 border-b border-white/10 bg-black/20'>
                <div className="relative">
                    <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="w-10 h-10 rounded-full object-cover border border-violet-500/50" />
                    {onlineUsers?.includes(selectedUser._id) && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#1c1631]"></span>
                    )}
                </div>
                <div className="flex-1">
                    <p className='text-sm font-semibold text-white'>{selectedUser.fullName}</p>
                    <p className='text-[10px] text-gray-400'>{onlineUsers?.includes(selectedUser._id) ? "Online" : "Offline"}</p>
                </div>
                <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="back" className='md:hidden w-6 cursor-pointer invert opacity-70 hover:opacity-100 transition-opacity' />
            </div>

            {/* ------- Chat Area ------- */}
            <div className='flex-1 overflow-y-auto p-4 space-y-6 flex flex-col'>
                {messages.map((msg, index) => {
                    const isMine = msg.senderId === authUser._id;
                    return (
                        <div key={index} className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse self-end' : 'flex-row self-start'}`}>
                            <img src={isMine ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} 
                                 alt="" className='w-6 h-6 rounded-full mb-1 object-cover' />
                            
                            <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                                {msg.image ? (
                                    <img src={msg.image} alt="shared" className='max-w-[250px] rounded-2xl border border-white/10 shadow-lg' />
                                ) : (
                                    <div className={`p-3 max-w-[250px] text-sm rounded-2xl break-words shadow-md
                                        ${isMine ? 'bg-violet-600 text-white rounded-br-none' : 'bg-white/10 text-gray-200 rounded-bl-none'}`}>
                                        {msg.text}
                                    </div>
                                )}
                                <p className='text-[9px] text-gray-500 mt-1 font-medium'>{formatMessageTime(msg.createdAt)}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollEnd}></div>
            </div>

            {/* ------- Bottom Input Area ------- */}
            <form onSubmit={handleSendMessage} className='p-4 bg-black/30 border-t border-white/10 flex items-center gap-3'>
                <div className='flex-1 flex items-center bg-white/5 border border-white/10 rounded-2xl px-3 group focus-within:ring-1 focus-within:ring-violet-500/50 transition-all'>
                    <input 
                        onChange={(e) => setInput(e.target.value)} 
                        value={input} 
                        type="text" 
                        placeholder="Type a message..." 
                        className='flex-1 text-sm py-3 bg-transparent outline-none text-white placeholder-gray-500'
                    />
                    <input onChange={handleSendImage} type="file" id='image' accept='image/*' hidden />
                    <label htmlFor="image">
                        <img src={assets.gallery_icon} alt="gallery" className="w-5 mr-1 cursor-pointer opacity-50 hover:opacity-100 transition-opacity" />
                    </label>
                </div>
                <button type="submit" className="p-3 bg-violet-600 rounded-xl hover:bg-violet-700 active:scale-95 transition-all shadow-lg shadow-violet-500/20">
                    <img src={assets.send_button} alt="send" className="w-5 invert" />
                </button>
            </form>
        </div>
    ) : (
        <div className='flex-1 flex flex-col items-center justify-center gap-4 bg-[#1c1631]/40 text-gray-400 max-md:hidden'>
            <img src={assets.logo_icon} className='w-24 opacity-10 animate-pulse' alt="logo" />
            <div className="text-center">
                <p className='text-xl font-semibold text-white/50'>QuickChat</p>
                <p className='text-sm italic opacity-40'>Select a friend to start chatting</p>
            </div>
        </div>
    )
}

export default ChatContainer;