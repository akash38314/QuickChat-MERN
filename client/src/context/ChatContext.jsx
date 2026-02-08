import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({}); // Badge logic
    
    const { socket, axios, authUser } = useContext(AuthContext);

    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) setUsers(data.users);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) setMessages(data.messages);
        } catch (error) {
            toast.error("Error loading chat history");
        }
    };

    // Sending Logic for Text and Image
    const sendMessage = async (messageData) => {
        try {
            if (!selectedUser) return;
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if (data.success) {
                setMessages((prev) => [...prev, data.message]);
            }
        } catch (error) {
            toast.error("Message delivery failed");
        }
    };

    useEffect(() => {
        if (authUser) getUsers();
    }, [authUser]);

    // Real-time Socket Listener Polish
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (msg) => {
            // Check if message belongs to current chat
            if (selectedUser?._id === msg.senderId) {
                setMessages((prev) => [...prev, msg]);
            } else {
                // Update unseen count for other users
                setUnseenMessages((prev) => ({
                    ...prev,
                    [msg.senderId]: (prev[msg.senderId] || 0) + 1
                }));
            }
        };

        socket.on("newMessage", handleNewMessage);
        return () => socket.off("newMessage", handleNewMessage);
    }, [socket, selectedUser]);

    const value = {
        messages,
        users,
        selectedUser,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
        getUsers,
        getMessages,
        sendMessage
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};