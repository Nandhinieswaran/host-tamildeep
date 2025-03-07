import { useState, useEffect } from "react";
import { Send, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  type: "user" | "bot";
  content: string;
}

interface Props {
  isEnglish: boolean;
}

export default function ChatInterface({ isEnglish }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: "bot",
      content: isEnglish
        ? "Greetings! I am Bharathiar's AI representation. Let's explore Tamil literature, poetry, and my works together. What would you like to discuss?"
        : "வணக்கம்! நான் பாரதியாரின் AI பிரதிநிதி. தமிழ் இலக்கியம், கவிதை மற்றும் என் படைப்புகளை பற்றி பேசலாம். என்ன பேச விரும்புகிறீர்கள்?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<
    "untested" | "connected" | "error"
  >("untested");

  // Backend URL - can be changed based on your environment
  const BACKEND_URL = "http://localhost:8000";

  // Generate session ID when component mounts
  useEffect(() => {
    const newSessionId = crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2);
    setSessionId(newSessionId);

    // Test connection to backend on component mount
    checkBackendConnection();
  }, []);

  // Function to check if backend is reachable
  const checkBackendConnection = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Backend connection established");
        setConnectionStatus("connected");
      } else {
        console.error("Backend health check failed:", await response.text());
        setConnectionStatus("error");
      }
    } catch (error) {
      console.error("Cannot connect to backend:", error);
      setConnectionStatus("error");
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = input.trim();
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    console.log("Sending message to backend:", {
      user_input: userMessage,
      session_id: sessionId,
      language: isEnglish ? "en" : "ta",
    });

    try {
      // Connect to backend API
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_input: userMessage,
          session_id: sessionId,
          language: isEnglish ? "en" : "ta",
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Server responded with status: ${response.status}, ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Received data:", data);

      // Add bot response
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content:
            data.response ||
            (isEnglish
              ? "I received your message but couldn't generate a proper response."
              : "உங்கள் செய்தியைப் பெற்றேன், ஆனால் சரியான பதிலை உருவாக்க முடியவில்லை."),
        },
      ]);
    } catch (error) {
      console.error("Error sending/receiving message:", error);

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: isEnglish
            ? `Error connecting to server: ${error.message}. Please check if the backend is running on ${BACKEND_URL}.`
            : `சேவையகத்துடன் இணைப்பதில் பிழை: ${error.message}. பின்னணி ${BACKEND_URL} இல் இயங்குகிறதா என்பதைச் சரிபார்க்கவும்.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden">
      <div className="p-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-white">
        <h3 className="text-lg font-semibold text-gray-800">
          {isEnglish ? "Chat with Bharathiar" : "பாரதியாருடன் உரையாடல்"}
        </h3>
        <p className="text-sm text-gray-600">
          {isEnglish
            ? "Explore Tamil literature and poetry"
            : "தமிழ் இலக்கியம் மற்றும் கவிதையை ஆராயுங்கள்"}
        </p>
        {connectionStatus === "error" && (
          <div className="mt-1 text-xs text-red-500">
            {isEnglish
              ? "Warning: Cannot connect to backend server"
              : "எச்சரிக்கை: பின்னணி சேவையகத்துடன் இணைக்க முடியவில்லை"}
          </div>
        )}
      </div>

      <div className="h-[400px] p-4 overflow-y-auto bg-amber-50/30">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-lg max-w-[80%] ${
                    message.type === "user"
                      ? "bg-amber-700 text-white"
                      : "bg-white border border-amber-100"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="p-3 rounded-lg bg-white border border-amber-100">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-amber-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              isEnglish ? "Ask Bharathiar..." : "பாரதியாரிடம் கேளுங்கள்..."
            }
            className="flex-1 p-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            disabled={isLoading}
          />
          <button
            onClick={() => {
              /* Voice input functionality */
            }}
            className="p-2 text-amber-700 hover:text-amber-800 transition-colors"
            disabled={isLoading}
          >
            <Mic size={20} />
          </button>
          <button
            onClick={handleSend}
            className="p-2 text-amber-700 hover:text-amber-800 transition-colors"
            disabled={isLoading}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
