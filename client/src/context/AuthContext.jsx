import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

function isTokenExpired(token) {
    try {
        const { exp } = jwtDecode(token);
        return Date.now() >= exp * 1000;
    } catch {
        return true;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken && isTokenExpired(savedToken)) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            return null;
        }
        return savedToken;
    });

    const login = ({ user: userData, token }) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };
    useEffect(() => {
        if (!token) return;

        const { exp } = jwtDecode(token);
        const expirationTime = exp * 1000 - Date.now();

        if (expirationTime > 0) {
            const timer = setTimeout(() => {
            logout();
            }, expirationTime);

            return () => clearTimeout(timer); 
        } else {
            logout();
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
