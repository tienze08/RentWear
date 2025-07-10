import { useEffect, useRef, useState } from "react";
import { X, Send, Sparkles, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { geminiApiService } from "@/config/AIModel";
import ReactMarkdown from "react-markdown";

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

export const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hi! I'm your AI styling assistant. I can help you find the perfect outfit for any occasion. What are you looking for today?",
            isUser: false,
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        const userInput = inputValue;
        setInputValue("");

        try {
            const aiText = await geminiApiService.generateResponse(userInput);

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: aiText,
                isUser: false,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiResponse]);
        } catch (error) {
            const errorResponse: Message = {
                id: (Date.now() + 2).toString(),
                text: "Oops! I had trouble thinking of a response. Please try again.",
                isUser: false,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, errorResponse]);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen ? (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="relative rounded-full h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse group"
                    size="icon"
                >
                    <Sparkles className="h-7 w-7 text-white group-hover:rotate-12 transition-transform duration-300" />
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full animate-ping"></div>
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full"></div>
                </Button>
            ) : (
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 h-[500px] flex flex-col overflow-hidden animate-scale-in">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <Sparkles className="h-4 w-4" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <span className="font-semibold text-sm">
                                    AI Style Assistant
                                </span>
                                <div className="text-xs opacity-90">Online</div>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="h-8 w-8 text-white hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-gray-50 to-white">
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-2 animate-fade-in ${
                                        message.isUser
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    {!message.isUser && (
                                        <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-auto">
                                            <Bot className="h-4 w-4 text-white" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${
                                            message.isUser
                                                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md"
                                                : "bg-white text-gray-800 border border-gray-100 rounded-bl-md"
                                        }`}
                                    >
                                        {!message.isUser ? (
                                            <div className="prose prose-sm prose-a:text-blue-600 hover:prose-a:underline">
                                                <ReactMarkdown
                                                    components={{
                                                        a: ({
                                                            node,
                                                            ...props
                                                        }) => (
                                                            <a
                                                                {...props}
                                                                className="text-pink-600 font-semibold underline underline-offset-2 hover:text-pink-700 hover:underline"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            />
                                                        ),
                                                    }}
                                                >
                                                    {message.text}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            message.text
                                        )}
                                    </div>
                                    {message.isUser && (
                                        <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-auto">
                                            <User className="h-4 w-4 text-gray-600" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div ref={bottomRef} />
                        </div>
                    </ScrollArea>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="flex gap-2">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask for style advice..."
                                className="flex-1 rounded-full border-gray-200 focus:border-purple-300 focus:ring-purple-200 px-4"
                            />
                            <Button
                                onClick={handleSendMessage}
                                size="icon"
                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full h-10 w-10 shadow-lg transform hover:scale-105 transition-all duration-200"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="text-xs text-gray-400 mt-2 text-center">
                            Powered by AI • Always here to help
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
