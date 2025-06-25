
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useChat } from "../contexts/ChatContext"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Send, X, MoreVertical, Phone, Video } from "lucide-react"
import type { User } from "@/lib/types"

interface ChatWindowProps {
  conversationId: string
  onClose?: () => void
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, onClose }) => {
  const { messages, conversations, sendMessage } = useChat()
  const { user } = useAuth()
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const endOfMessagesRef = useRef<HTMLDivElement>(null)
  const [initialLoad, setInitialLoad] = useState(true)

  const conversation = conversations.find((c) => c._id === conversationId)
  const other = conversation?.participants?.find((p: User) => p._id !== user?._id)

  const getOtherAvatar = (other: User | undefined) => other?.avatar || other?.storeInfo?.logoUrl || undefined
  const getOtherName = (other: User | undefined) => other?.username || other?.storeInfo?.storeName || "Đối phương"

  const isOwnMessage = (message: any) => {
    if (!user) return false
    if (typeof message.sender === "string") return message.sender === user._id
    if (typeof message.sender === "object" && message.sender._id) return message.sender._id === user._id
    return false
  }

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      })
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    if (initialLoad) setInitialLoad(false)
    return () => clearTimeout(timer)
  }, [messages, initialLoad])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && conversationId) {
      setIsSending(true)
      sendMessage(conversationId, newMessage.trim())
      setNewMessage("")
      setTimeout(() => setIsSending(false), 1000)
    }
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex flex-col h-[700px] w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Chat header */}
      <div className="relative p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-12 h-12 border-2 border-white/20">
                <AvatarImage src={getOtherAvatar(other) || "/placeholder.svg"} />
                <AvatarFallback className="bg-white/20 text-white font-semibold">
                  {getOtherName(other)?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{getOtherName(other)}</h3>
              <p className="text-white/80 text-sm">Đang hoạt động</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-full p-2">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-full p-2">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-full p-2">
              <MoreVertical className="w-5 h-5" />
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/10 rounded-full p-2 ml-2"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 bg-gradient-to-b from-gray-50 to-white">
        <div className="p-6 space-y-6">
          {messages.map((message, index) => {
            const isOwn = isOwnMessage(message)
            const showAvatar = index === 0 || isOwnMessage(messages[index - 1]) !== isOwn

            return (
              <div key={message._id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-end gap-3 max-w-[75%] ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                  {showAvatar ? (
                    <Avatar className="w-8 h-8 shadow-md">
                      <AvatarImage src={isOwn ? user?.avatar || user?.storeInfo?.logoUrl : getOtherAvatar(other)} />
                      <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                        {isOwn
                          ? user?.username?.[0] || user?.storeInfo?.storeName?.[0] || "?"
                          : getOtherName(other)?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-8 h-8" />
                  )}

                  <div
                    className={`group relative rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md ${
                      isOwn
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">{message.content}</p>
                    <div
                      className={`flex items-center justify-end gap-1 mt-2 ${
                        isOwn ? "text-blue-100" : "text-gray-400"
                      }`}
                    >
                      <span className="text-xs">{formatTime(message.createdAt)}</span>
                      {isOwn && (
                        <div className="flex">
                          <div className="w-1 h-1 bg-current rounded-full"></div>
                          <div className="w-1 h-1 bg-current rounded-full ml-0.5"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={endOfMessagesRef} />
        </div>
      </ScrollArea>

      {/* Message input */}
      <div className="p-6 bg-white border-t border-gray-100">
        <form onSubmit={handleSend} className="flex items-end gap-3">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isSending ? "Đang gửi..." : "Nhập tin nhắn..."}
              className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 resize-none transition-colors duration-200"
              disabled={isSending}
              autoComplete="off"
            />
          </div>
          <Button
            type="submit"
            disabled={!conversationId || isSending || !newMessage.trim()}
            className="rounded-2xl px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>

        {/* Typing indicator */}
        <div className="mt-2 text-xs text-gray-400 h-4">{/* You can add typing indicator here */}</div>
      </div>
    </div>
  )
}
