// src/services/gemini-api.service.ts

interface ChatHistoryItem {
    role: "user" | "model";
    parts: Array<{
        text?: string;
        inline_data?: {
            mimeType: string;
            data: string;
        };
    }>;
}

interface GeminiResponse {
    candidates: Array<{
        content: {
            parts: Array<{
                text: string;
            }>;
        };
    }>;
    error?: {
        message: string;
    };
}

export class GeminiApiService {
    private readonly API_KEY: string;
    private readonly API_URL: string;
    private chatHistory: ChatHistoryItem[] = [];

    constructor() {
        const key = import.meta.env.VITE_GEMINI_API_KEY;

        if (!key) {
            throw new Error("Missing Gemini API key in environment variables");
        }

        this.API_KEY = key;
        this.API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.API_KEY}`;

        this.initializeChatHistory();
    }

    private initializeChatHistory(): void {
        if (this.chatHistory.length === 0) {
            this.chatHistory.push({
                role: "user",
                parts: [
                    {
                        text: `Bạn là một AI Style Assistant. Chỉ tư vấn thật sự ngắn gọn về cách ăn mặc, thời trang, phối đồ. 
Nếu người dùng hỏi điều không liên quan đến thay đồ hoặc phong cách, hãy từ chối trả lời. 
Sau khi tư vấn nên mặc gì, hãy đề xuất thêm món đồ tương ứng có trong cửa hàng thời trang "Fashion Forward" nếu phù hợp. 

Danh sách món đồ hiện tại bao gồm:
- **Black Evening Gown**: đầm dạ hội màu đen, phù hợp sự kiện trang trọng.
- **Business Suit**: bộ suit công sở thanh lịch, size S.
- **Summer Festival**: phụ kiện mùa hè, size XL.
- **Hello babeaaa**: phụ kiện thời trang, size XL.
- **Váy đỏ**: đầm đỏ, size L.

Nếu gợi ý món nào phù hợp, hãy ghi rõ tên sản phẩm và thêm link dưới dạng markdown như sau: 
[Click vào đây để xem tại Fashion Forward](http://localhost:3000/stores/684456b6f5ae4ac0b93e2c03)`,
                    },
                ],
            });
        }
    }

    public async generateResponse(
        userMessage: string,
        imageData?: {
            data: string;
            mimeType: string;
        }
    ): Promise<string> {
        this.addUserMessageToHistory(userMessage, imageData);

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: this.chatHistory,
            }),
        };

        try {
            const response = await fetch(this.API_URL, requestOptions);
            const data: GeminiResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "API request failed");
            }

            const responseText = this.formatResponseText(data);
            this.addBotMessageToHistory(responseText);
            return responseText;
        } catch (error) {
            console.error("Error generating response:", error);
            throw error;
        }
    }

    private addUserMessageToHistory(
        message: string,
        imageData?: {
            data: string;
            mimeType: string;
        }
    ): void {
        this.chatHistory.push({
            role: "user",
            parts: [
                { text: message },
                ...(imageData
                    ? [
                          {
                              inline_data: {
                                  mimeType: imageData.mimeType,
                                  data: imageData.data,
                              },
                          },
                      ]
                    : []),
            ],
        });
    }

    private addBotMessageToHistory(message: string): void {
        this.chatHistory.push({
            role: "model",
            parts: [{ text: message }],
        });
    }

    private formatResponseText(data: GeminiResponse): string {
        const rawText = data.candidates[0].content.parts[0].text || "";

        return rawText
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .replace(/\*(.*?)\*/g, "$1")
            .replace(/^- /gm, "• ")
            .replace(/^\d+\. /gm, (match) => `${match}`)
            .replace(/\n{2,}/g, "\n\n")
            .trim();
    }

    public clearChatHistory(): void {
        this.chatHistory = [];
        this.initializeChatHistory();
    }
}

// Singleton instance
export const geminiApiService = new GeminiApiService();
