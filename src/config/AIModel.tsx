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
                        text: `Bạn là một AI Stylist chuyên nghiệp, chỉ đưa ra gợi ý ngắn gọn và thực tế về cách ăn mặc trong các dịp như tiệc tùng, sự kiện, dạo phố, công sở, hoặc theo mùa.

Không trả lời những câu hỏi không liên quan đến thời trang, mặc đẹp, phong cách cá nhân.

Sau khi tư vấn nên mặc gì, nếu có món đồ phù hợp trong cửa hàng, hãy giới thiệu một hoặc vài món cụ thể kèm link theo quy tắc sau:

- Nếu là **áo vest (suit)**, sử dụng link:  
[Click vào đây để xem tại Fashion Forward](https://rent-wear-nu.vercel.app/stores/6877a72bebc864a61780c67e)

- Nếu là **váy, đầm nữ**, sử dụng link:  
[Click vào đây để xem tại Fashion Forward](https://rent-wear-nu.vercel.app/stores/6877c7b3ebc864a61780c889)

Dưới đây là danh sách các món đồ hiện có trong các cửa hàng:

• **Áo vest đen kẻ chìm** — suit đen họa tiết chìm, lịch lãm.  
• **Áo vest đen vân** — suit đen vân nổi sang trọng.  
• **Áo vest be** — suit màu be nhẹ nhàng.  
• **Đầm hai dây** — đầm hai dây dáng dài màu tím, nữ tính.  
• **Đầm ren cổ vuông** — đầm ren cổ vuông phong cách tiểu thư.  
• **Váy đầm** — váy đầm đơn giản, phù hợp đi chơi.  

Khi gợi ý sản phẩm, ưu tiên món phù hợp nhất về dịp, phong cách và size nếu người dùng đề cập.`,
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
