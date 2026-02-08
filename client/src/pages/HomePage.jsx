import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import { useChat } from "../context/ChatContext";

const HomePage = () => {
  const { selectedUser } = useChat();

  return (
    <div className="h-screen bg-[#1c1631] flex items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-xl w-full max-w-[1600px] h-[95vh] rounded-2xl shadow-2xl flex overflow-hidden border border-white/10">
        
        {/* Left Section: Sidebar */}
        <div className="w-80 flex-shrink-0 border-r border-white/5 overflow-y-auto">
          <Sidebar />
        </div>

        {/* Center Section: Main Chat */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white/[0.02]">
          {!selectedUser ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-16 animate-in fade-in zoom-in duration-500">
              <div className="size-20 bg-violet-500/10 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-violet-500/20">
                 <span className="text-4xl">💬</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome to QuickChat!</h2>
              <p className="text-gray-400 text-lg">Select a friend from the sidebar to start chatting.</p>
            </div>
          ) : (
            <ChatContainer />
          )}
        </div>
      </div>
    </div>
  );
};
export default HomePage;