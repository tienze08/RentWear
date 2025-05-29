import React from "react";
import { Layout } from "@/components/layout/Layout";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useAuth } from "@/components/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Chat = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-fashion-DEFAULT mb-8">Chat</h1>
        <ChatWindow />
      </div>
    </Layout>
  );
};

export default Chat;
