import React, { createContext, useEffect, useState, useCallback, useContext } from "react";
import axios from 'axios';
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// IMPORTANT: Netlify deployment ke liye environment variable use karein
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"; 
const API_URL = `${BASE_URL}/api`;

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    const connectSocket = useCallback((userData) => {
        if (!userData?._id || socket?.connected) return;
        const newSocket = io(BASE_URL, {
            query: { userId: userData._id },
        });
        setSocket(newSocket);
        newSocket.on("getOnlineUsers", (userIds) => setOnlineUsers(userIds));
    }, [socket]);

    const checkAuth = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsCheckingAuth(false);
            return;
        }
        try {
            const { data } = await axiosInstance.get("/auth/check", {
                headers: { token: token }
            });
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            setAuthUser(null);
            localStorage.removeItem("token");
        } finally {
            setIsCheckingAuth(false);
        }
    };

    const login = async (action, credentials) => {
        try {
            const { data } = await axiosInstance.post(`/auth/${action}`, credentials);
            if (data.success) {
                localStorage.setItem("token", data.token);
                const user = data.userData || data.user;
                setAuthUser(user);
                connectSocket(user);
                toast.success(data.message || "Success!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Auth Failed");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setAuthUser(null);
        setOnlineUsers([]);
        socket?.disconnect();
        setSocket(null);
        toast.success("Logged out");
    };

    useEffect(() => { checkAuth(); }, []);

    return (
        <AuthContext.Provider value={{ 
            authUser, onlineUsers, socket, login, logout, 
            checkAuth, isCheckingAuth, updateProfile: null, isUpdatingProfile 
        }}>
            {children}
        </AuthContext.Provider>
    );
};