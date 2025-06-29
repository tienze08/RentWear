import React, { useState } from "react";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useChat } from "@/components/contexts/ChatContext";
import { Layout } from "@/components/layout/Layout";

const ChatPage: React.FC = () => {
  const { activeConversationId, setActiveConversationId } = useChat();
  const [selectedId, setSelectedId] = useState<string | null>(
    activeConversationId
  );

  const handleSelect = (id: string) => {
    setActiveConversationId(id);
    setSelectedId(id);
  };

  return (
    <Layout>
      <div className="flex h-[80vh] bg-gray-50 rounded-lg shadow-lg overflow-hidden max-w-5xl mx-auto">
        <ChatList onSelect={handleSelect} selectedId={selectedId} />
        <div className="flex-1 flex items-center justify-center bg-white">
          {selectedId ? (
            <ChatWindow conversationId={selectedId} />
          ) : (
            <div className="text-gray-400 text-lg">
              Chọn một cuộc trò chuyện để bắt đầu
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
