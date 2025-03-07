import { useState } from "react";
import { X, Send, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  type: "user" | "bot";
  content: string;
}

interface Props {
  isEnglish: boolean;
  onClose: () => void;
}

export default function ChatbotFullscreen({ isEnglish, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: "bot",
      content: isEnglish
        ? "Greetings! I am Bharathiar's AI representation. Let's explore Tamil literature, poetry, and my works together. What would you like to discuss?"
        : "வணக்கம்! நான் பாரதியாரின் AI பிரதிநிதி. தமிழ் இலக்கியம் மற்றும் என் படைப்புகளை பற்றி பேசலாம். என்ன பேச விரும்புகிறீர்கள்?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { type: "user", content: input }]);

      setIsLoading(true);

      try {
        // Create a unique session ID if needed
        const sessionId =
          localStorage.getItem("chat_session_id") ||
          Math.random().toString(36).substring(2, 15);

        // Store session ID for future use
        localStorage.setItem("chat_session_id", sessionId);

        const response = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            user_input: input,
            session_id: sessionId,
            language: isEnglish ? "en" : "ta",
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Check if the response has the expected structure
        const botResponse =
          data.response ||
          (isEnglish
            ? "Sorry, I couldn't process that request."
            : "மன்னிக்கவும், எனக்கு அந்த கோரிக்கையை செயலாக்க முடியவில்லை.");

        setMessages((prev) => [...prev, { type: "bot", content: botResponse }]);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content: isEnglish
              ? "Error connecting to server. Please try again later."
              : "சேவையகத்துடன் இணைப்பில் பிழை. பின்னர் மீண்டும் முயற்சிக்கவும்.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }

      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
        {/* Header */}
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

        {/* Messages */}
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
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="p-3 rounded-lg bg-white border border-amber-100">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-amber-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isEnglish ? "Ask Bharathiar..." : "பாரதியாரிடம் கேளுங்கள்..."
              }
              className="flex-1 p-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              disabled={isLoading}
            />
            <button
              onClick={() => {}}
              className="p-3 text-amber-700 hover:text-amber-800 transition-colors"
              disabled={isLoading}
            >
              <Mic size={20} />
            </button>
            <button
              onClick={handleSend}
              className={`p-3 ${
                isLoading ? "bg-amber-400" : "bg-amber-700 hover:bg-amber-800"
              } text-white rounded-lg transition-colors`}
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
