import { useEffect } from "react";
import { useChat } from "../context/ChatContext";

const Sidebar = () => {
  const { getUsers, users, isUsersLoading, setSelectedUser, selectedUser } = useChat();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <div className="p-10 text-gray-400 animate-pulse">Loading contacts...</div>;

  return (
    <div className="h-full flex flex-col bg-white/[0.02]">
      <div className="p-5 border-b border-white/5 font-bold text-xl text-white">Chats</div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Important Fix: Array.isArray check */}
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-all ${
                selectedUser?._id === user._id ? "bg-white/10 border-r-2 border-violet-500" : ""
              }`}
            >
              <div className="relative">
                <img src={user.profilePic || "/avatar.png"} className="size-12 rounded-full object-cover border border-white/10" alt="" />
              </div>
              <div className="text-left overflow-hidden">
                <div className="text-white font-medium truncate">{user.fullName}</div>
                <div className="text-xs text-gray-500 truncate">{user.bio || "Available"}</div>
              </div>
            </button>
          ))
        ) : (
          <div className="p-10 text-center text-gray-500 text-sm">No users found</div>
        )}
      </div>
    </div>
  );
};
export default Sidebar;