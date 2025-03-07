import { useState, useEffect, useRef } from "react";
import { X, Send, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  type: "user" | "bot";
  content: string;
  timestamp?: string;
  id?: number;
}

interface Props {
  isEnglish: boolean;
  onClose: () => void;
}

// API URL - change this to match your FastAPI server location
//const API_URL = "http://localhost:8000"; old where not able to push!
const API_URL = "http://192.168.1.100:8000"; // newly Changed

export default function ChatbotFullscreen({ isEnglish, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: "bot",
      content: isEnglish
        ? "Greetings! I am Bharathiar's AI representation. Let's explore Tamil literature, poetry, and my works together. What would you like to discuss?"
        : "வணக்கம்! நான் பாரதியாரின் AI பிரதிநிதி. தமிழ் இலக்கியம், கவிதை மற்றும் என் படைப்புகளை பற்றி பேசலாம். என்ன பேச விரும்புகிறீர்கள்?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Generate a session ID when the component mounts
  useEffect(() => {
    // Generate a random session ID or get from localStorage if exists
    const existingSessionId = localStorage.getItem("chatSessionId");
    if (existingSessionId) {
      setSessionId(existingSessionId);
    } else {
      const newSessionId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("chatSessionId", newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const userInput = input.trim();
      // Add user message to chat
      const userMessage: ChatMessage = {
        type: "user",
        content: userInput,
        timestamp: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        // Call the FastAPI backend
        const response = await fetch(`${API_URL}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_input: userInput,
            session_id: sessionId,
            language: isEnglish ? "en" : "ta",
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Add bot response to chat
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: "bot",
            content: data.response,
            timestamp: new Date().toISOString(),
            id: data.chat_id, // Assuming your API returns the DB ID
          },
        ]);
      } catch (error) {
        console.error("Failed to get response from API:", error);
        // Add error message
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: "bot",
            content: isEnglish
              ? "I'm sorry, I encountered an error. Please try again later."
              : "மன்னிக்கவும், ஒரு பிழை ஏற்பட்டது. பின்னர் மீண்டும் முயற்சிக்கவும்.",
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[75vh] flex flex-col"
      >
        <div className="p-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {isEnglish ? "Chat with Bharathiar" : "பாரதியாருடன் உரையாடல்"}
            </h3>
            <p className="text-sm text-gray-600">
              {isEnglish
                ? "Explore Tamil literature and poetry"
                : "தமிழ் இலக்கியம் மற்றும் கவிதையை ஆராயுங்கள்"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-amber-50/30">
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
                    {message.timestamp && (
                      <p className="text-xs mt-1 opacity-70 text-right">
                        {formatTime(message.timestamp)}
                      </p>
                    )}
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
                  <p className="text-sm flex items-center">
                    <span className="mr-2">
                      {isEnglish ? "Thinking..." : "சிந்திக்கிறது..."}
                    </span>
                    <span className="flex space-x-1">
                      <span
                        className="h-2 w-2 bg-amber-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></span>
                      <span
                        className="h-2 w-2 bg-amber-500 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></span>
                      <span
                        className="h-2 w-2 bg-amber-500 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></span>
                    </span>
                  </p>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
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
              className="flex-1 p-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              disabled={isLoading}
            />
            <button
              onClick={() => {
                /* Voice input functionality */
              }}
              className="p-3 text-amber-700 hover:text-amber-800 transition-colors"
              disabled={isLoading}
            >
              <Mic size={20} />
            </button>
            <button
              onClick={handleSend}
              className={`p-3 bg-amber-700 text-white rounded-lg transition-colors ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-amber-800"
              }`}
              disabled={isLoading}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
