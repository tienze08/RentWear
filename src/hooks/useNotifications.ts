import { useState } from "react";

export interface Notification {
  id: string;
  type: "user_complaint" | "shop_complaint";
  entityId: number;
  entityName: string;
  complainant: string;
  reason: string;
  severity: "Low" | "Medium" | "High";
  timestamp: string;
  read: boolean;
}

// Mock notifications data - in a real app this would come from an API
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "user_complaint",
    entityId: 1,
    entityName: "John Smith",
    complainant: "Store Manager",
    reason: "Inappropriate behavior",
    severity: "Medium",
    timestamp: "2025-06-11T10:30:00Z",
    read: false,
  },
  {
    id: "2",
    type: "shop_complaint",
    entityId: 2,
    entityName: "Urban Outdoor Shop",
    complainant: "Partner Report",
    reason: "Policy violations",
    severity: "High",
    timestamp: "2025-06-11T09:15:00Z",
    read: false,
  },
  {
    id: "3",
    type: "user_complaint",
    entityId: 2,
    entityName: "Emma Wilson",
    complainant: "System Alert",
    reason: "Multiple late returns",
    severity: "Low",
    timestamp: "2025-06-11T08:45:00Z",
    read: true,
  },
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const addNotification = (notification: Omit<Notification, "id">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
  };
};