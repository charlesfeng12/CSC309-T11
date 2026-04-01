import React, { createContext, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch(`${BACKEND_URL}/user/me`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => res.ok ? res.json() : Promise.reject())
            .then((data) => setUser(data.user))
            .catch(() => {
                localStorage.removeItem("token");
                setUser(null);
            });
        } else {
            setUser(null);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
    };

    const login = async (username, password) => {
        const res = await fetch(`${BACKEND_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) return data.message;

        localStorage.setItem("token", data.token);

        const userRes = await fetch(`${BACKEND_URL}/user/me`, {
            headers: { Authorization: `Bearer ${data.token}` },
        });
        const userData = await userRes.json();
        setUser(userData.user);

        navigate("/profile");
    };

    const register = async (userData) => {
        const res = await fetch(`${BACKEND_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        const data = await res.json();
        if (!res.ok) return data.message;

        navigate("/success");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
