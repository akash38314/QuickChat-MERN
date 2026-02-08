import { useEffect, useRef, useState } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { Send, X, Loader } from "lucide-react";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, setSelectedUser, sendMessage } = useChat();
  const { authUser, onlineUsers } = useAuth();
  const [text, setText] = useState("");
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) getMessages(selectedUser._id);
  }, [selectedUser?._id, getMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await sendMessage({ text: text.trim() });
    setText("");
  };

  if (isMessagesLoading) return (
    <div className="flex-1 flex items-center justify-center bg-[#1c1631]">
      <Loader className="animate-spin text-violet-500" size={40} />
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
      {/* 🟢 INTERNAL HEADER: No separate file needed */}
      <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-3">
          <img src={selectedUser.profilePic || "/avatar.png"} className="size-10 rounded-full object-cover" alt="" />
          <div>
            <h3 className="font-medium text-white text-sm">{selectedUser.fullName}</h3>
            <p className="text-[10px] text-green-500">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <button onClick={() => setSelectedUser(null)}><X className="text-gray-400 hover:text-white" size={20} /></button>
      </div>

      {/* 🟢 MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {Array.isArray(messages) && messages.map((m) => (
          <div key={m._id} className={`chat ${m.senderId === authUser._id ? "chat-end" : "chat-start"}`}>
            <div className={`chat-bubble max-w-[85%] text-sm ${m.senderId === authUser._id ? "bg-violet-600 shadow-lg" : "bg-white/10"}`}>
              {m.text}
              <p className="text-[9px] opacity-40 mt-1 text-right">
                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* 🟢 INTERNAL INPUT: No separate file needed */}
      <form onSubmit={handleSend} className="p-4 border-t border-white/5 flex gap-2">
        <input 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="Type a message..." 
          className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-violet-500" 
        />
        <button type="submit" disabled={!text.trim()} className="bg-violet-600 hover:bg-violet-700 p-2.5 rounded-xl text-white transition-all">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
export default ChatContainer;