import { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext<any>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [adoptNotifCount, setAdoptNotifCount] = useState(0);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setAdoptNotifCount(0);
    const res = await fetch("/api/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const unread = data.notifications?.filter((n: any) => !n.read && n.type === "adopt").length || 0;
    setAdoptNotifCount(unread);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationContext.Provider value={{ adoptNotifCount, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}