import React, { createContext, useEffect, useState, useCallback } from "react";
import axios from 'axios';
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5000"; 
const API_URL = `${BASE_URL}/api`;

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    const connectSocket = useCallback((userData) => {
        if (!userData || socket?.connected) return;
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

    const login = async (state, credentials) => {
        try {
            const { data } = await axiosInstance.post(`/auth/${state}`, credentials);
            if (data.success) {
                localStorage.setItem("token", data.token);
                setAuthUser(data.userData || data.user);
                connectSocket(data.userData || data.user);
                toast.success(data.message || "Success!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login/Signup Failed");
        }
    };

    // UPDATE PROFILE FUNCTION (Ye missing tha!)
    const updateProfile = async (formData) => {
        setIsUpdatingProfile(true);
        const token = localStorage.getItem("token");
        try {
            const { data } = await axiosInstance.put("/auth/update-profile", formData, {
                headers: { token: token }
            });
            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile Updated Successfully!");
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
            return false;
        } finally {
            setIsUpdatingProfile(false);
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

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ 
            authUser, 
            onlineUsers, 
            socket, 
            login, 
            logout, 
            isCheckingAuth, 
            updateProfile, // Exported now
            isUpdatingProfile 
        }}>
            {children}
        </AuthContext.Provider>
    );
};