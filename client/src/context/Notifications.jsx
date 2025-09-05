import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";


export const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const { token, user } = useContext(AuthContext);
  

    useEffect(() => {
        if (!token) return;

        async function fetchNotifications() {
            try {
                const res = await fetch("http://localhost:5055/api/profile/notifications", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error("Failed to fetch notifications");
                const data = await res.json();
                setNotifications(data);
            } catch (err) {
                console.error(err);
            }
        }

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); 
        return () => clearInterval(interval);
    }, [token]);

    return (
        <NotificationsContext.Provider value={{ notifications, setNotifications }}>
            {children}
        </NotificationsContext.Provider>
    );
}
