import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import ApiConstants from "@/lib/api";

export interface Message {
  _id: string;
  conversation: string;
  sender: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  participants: any[];
  lastMessage?: Message;
  updatedAt: string;
}

interface ChatContextType {
  conversations: Conversation[];
  messages: Message[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => void;
  startConversation: (otherUserId: string) => Promise<string | null>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);

  // Fetch all conversations of current user
  const fetchConversations = useCallback(async () => {
    if (!user?._id) return;
    const res = await axiosInstance.get(
      ApiConstants.GET_USER_CONVERSATIONS(user._id)
    );
    setConversations(res.data);
  }, [user]);

  // Fetch messages of a conversation
  const fetchMessages = useCallback(
    async (conversationId: string) => {
      const res = await axiosInstance.get(
        ApiConstants.GET_CONVERSATION_MESSAGES(conversationId)
      );
      setMessages(res.data);
      // Join socket room
      socket?.emit("join_conversation", conversationId);
    },
    [socket]
  );

  // Start or get conversation with another user (store hoặc customer)
  const startConversation = useCallback(
    async (otherUserId: string) => {
      if (!user?._id) return null;
      const res = await axiosInstance.post(
        ApiConstants.CREATE_OR_GET_CONVERSATION,
        {
          userId1: user._id,
          userId2: otherUserId,
        }
      );
      const conversationId = res.data._id;
      await fetchConversations();
      setActiveConversationId(conversationId);
      await fetchMessages(conversationId);
      return conversationId;
    },
    [user, fetchConversations, fetchMessages]
  );

  // Send message via socket
  const sendMessage = useCallback(
    (conversationId: string, content: string) => {
      if (!socket || !user?._id) return;
      socket.emit("send_message", {
        conversationId,
        senderId: user._id,
        content,
      });
    },
    [socket, user]
  );

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;
    const handleReceive = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      // Cập nhật lastMessage cho conversation
      setConversations((prev) =>
        prev.map((c) =>
          c._id === msg.conversation ? { ...c, lastMessage: msg } : c
        )
      );
    };
    socket.on("receive_message", handleReceive);
    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, [socket]);

  // Khi đổi conversation, fetch lại messages
  useEffect(() => {
    if (activeConversationId) fetchMessages(activeConversationId);
  }, [activeConversationId, fetchMessages]);

  // Khi user login, fetch conversations
  useEffect(() => {
    if (user?._id) fetchConversations();
  }, [user, fetchConversations]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        messages,
        activeConversationId,
        setActiveConversationId,
        fetchConversations,
        fetchMessages,
        sendMessage,
        startConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
};
