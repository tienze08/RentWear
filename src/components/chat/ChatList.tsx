"use client";

import type React from "react";
import { useState } from "react";
import { useChat } from "../contexts/ChatContext";
import { useAuth } from "../contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Search, MessageCircle, Clock } from "lucide-react";

interface ChatListProps {
  onSelect: (conversationId: string) => void;
  selectedId: string | null;
}

export const ChatList: React.FC<ChatListProps> = ({ onSelect, selectedId }) => {
  const { conversations } = useChat();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy đối phương (store hoặc customer) trong conversation
  const getOther = (conv: any) => {
    if (!user) return null;
    return conv.participants.find((p: any) => p._id !== user._id);
  };

  // Format time for last message
  const formatLastMessageTime = (date: string) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours =
      Math.abs(now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return messageDate.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 24) {
      return messageDate.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Hôm qua";
    } else {
      return messageDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conv) => {
    const other = getOther(conv);
    const name = other?.username || other?.storeName || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Mock unread count (you can replace this with real data)
  const getUnreadCount = (convId: string) => {
    // This is mock data - replace with your actual unread logic
    return Math.floor(Math.random() * 5);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="w-6 h-6" />
          <h3 className="text-xl font-semibold">Tin nhắn</h3>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
          <Input
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 && !searchTerm && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MessageCircle className="w-12 h-12 mb-3 text-gray-300" />
            <p className="text-center px-4">Chưa có cuộc trò chuyện nào.</p>
            <p className="text-sm text-center px-4 mt-1">
              Bắt đầu trò chuyện với khách hàng!
            </p>
          </div>
        )}

        {filteredConversations.length === 0 && searchTerm && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Search className="w-12 h-12 mb-3 text-gray-300" />
            <p className="text-center px-4">
              Không tìm thấy cuộc trò chuyện nào.
            </p>
            <p className="text-sm text-center px-4 mt-1">
              Thử tìm kiếm với từ khóa khác.
            </p>
          </div>
        )}

        <div className="py-2">
          {filteredConversations.map((conv) => {
            const other = getOther(conv);
            const unreadCount = getUnreadCount(conv._id);
            const isSelected = selectedId === conv._id;
            const isOnline = Math.random() > 0.5; // Mock online status

            return (
              <div
                key={conv._id}
                className={`relative mx-2 mb-1 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-md"
                    : "hover:bg-gray-50 border-2 border-transparent"
                }`}
                onClick={() => onSelect(conv._id)}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Avatar with online status */}
                  <div className="relative">
                    <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                      <AvatarImage
                        src={
                          other?.avatar || other?.logoUrl || "/placeholder.svg"
                        }
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-400 text-white font-semibold">
                        {other?.username?.[0] || other?.storeName?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                    {isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={`font-semibold truncate ${
                          isSelected ? "text-blue-700" : "text-gray-900"
                        }`}
                      >
                        {other?.username || other?.storeName || "Người dùng"}
                      </h4>
                      {conv.lastMessage && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatLastMessageTime(conv.lastMessage.updatedAt)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm truncate ${
                          isSelected ? "text-blue-600" : "text-gray-600"
                        }`}
                      >
                        {conv.lastMessage?.content || "Chưa có tin nhắn"}
                      </p>
                      {/* {unreadCount > 0 && (
                        <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-full ml-2">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                      )} */}
                    </div>

                    {/* Status indicator */}
                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isOnline ? "bg-green-400" : "bg-gray-300"
                        }`}
                      ></div>
                      <span className="text-xs text-gray-400">
                        {isOnline ? "Đang hoạt động" : "Không hoạt động"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="text-center text-xs text-gray-500">
          {filteredConversations.length} cuộc trò chuyện
        </div>
      </div>
    </div>
  );
};
