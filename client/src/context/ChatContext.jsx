import React, { createContext, useState, useCallback, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"; 
const API_URL = `${BASE_URL}/api`;

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isUsersLoading, setIsUsersLoading] = useState(false);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);

    const getUsers = useCallback(async () => {
        setIsUsersLoading(true);
        const token = localStorage.getItem("token");
        try {
            const { data } = await axiosInstance.get("/messages/users", {
                headers: { token: token }
            });
            // Array check to prevent .map errors
            setUsers(Array.isArray(data) ? data : (data.users || []));
        } catch (error) {
            toast.error("Failed to load users");
        } finally {
            setIsUsersLoading(false);
        }
    }, []);

    const getMessages = useCallback(async (userId) => {
        setIsMessagesLoading(true);
        const token = localStorage.getItem("token");
        try {
            const { data } = await axiosInstance.get(`/messages/${userId}`, {
                headers: { token: token }
            });
            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error("Failed to load chat");
        } finally {
            setIsMessagesLoading(false);
        }
    }, []);

    const sendMessage = async (messageData) => {
        const token = localStorage.getItem("token");
        try {
            const { data } = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData, {
                headers: { token: token }
            });
            setMessages((prev) => [...prev, data]);
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

    return (
        <ChatContext.Provider value={{ 
            users, messages, selectedUser, isUsersLoading, 
            isMessagesLoading, getUsers, getMessages, setSelectedUser, sendMessage 
        }}>
            {children}
        </ChatContext.Provider>
    );
};