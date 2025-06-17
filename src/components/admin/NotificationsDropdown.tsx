import { Bell, User, Store, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications, type Notification } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";

const NotificationsDropdown = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } =
        useNotifications();

    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case "high":
                return "bg-red-100 text-red-800 border-red-200";
            case "medium":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "low":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getTypeIcon = (type: string) => {
        return type === "user_complaint" ? User : Store;
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-80 bg-white shadow-lg border border-gray-200 rounded-lg"
            >
                <div className="flex items-center justify-between p-3">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                        >
                            Mark all read
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator />
                <ScrollArea className="h-80">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            No notifications
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {notifications.map((notification) => {
                                const Icon = getTypeIcon(notification.type);
                                return (
                                    <DropdownMenuItem
                                        key={notification.id}
                                        className="p-0"
                                        onClick={() =>
                                            handleNotificationClick(
                                                notification
                                            )
                                        }
                                    >
                                        <Card
                                            className={`w-full p-3 border-0 shadow-none ${
                                                !notification.read
                                                    ? "bg-blue-50"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    <Icon className="h-4 w-4 text-gray-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm font-medium truncate">
                                                            {
                                                                notification.entityName
                                                            }
                                                        </span>
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-xs ${getSeverityColor(
                                                                notification.severity
                                                            )}`}
                                                        >
                                                            {
                                                                notification.severity
                                                            }
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mb-1">
                                                        {notification.reason}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        by{" "}
                                                        {
                                                            notification.complainant
                                                        }
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Clock className="h-3 w-3 text-gray-400" />
                                                        <span className="text-xs text-gray-400">
                                                            {formatDistanceToNow(
                                                                new Date(
                                                                    notification.timestamp
                                                                ),
                                                                {
                                                                    addSuffix:
                                                                        true,
                                                                }
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                {!notification.read && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                                )}
                                            </div>
                                        </Card>
                                    </DropdownMenuItem>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationsDropdown;
