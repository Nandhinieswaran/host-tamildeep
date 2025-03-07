import React, { useState } from "react";
import { Book, Users, Sparkles, ScrollText, Moon, Flame } from "lucide-react";
import ChatInterface from "./components/ChatInterface";
import PoemsSection from "./components/PoemsSection";
import VisionSection from "./components/VisionSection";
import ChatbotFullscreen from "./components/ChatbotFullscreen";

function App() {
  const [isEnglish, setIsEnglish] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showChatbot, setShowChatbot] = useState(false);

  const content = {
    tamil: {
      brand: "Deepதமிழ்",
      nav: {
        poems: "கவிதைகள்",
        vision: "நோக்கம்",
      },
      hero: {
        title: "தமிழ் மொழியின்",
        subtitle: "புதிய பரிமாணம்",
        description:
          "பாரதியாரின் படைப்புகளை AI மூலம் ஆராய்ந்து, தமிழ் இலக்கியத்தின் ஆழத்தை உணரும் புதிய அனுபவம். நவீன தொழில்நுட்பமும் பாரம்பரிய அறிவும் இணையும் தருணம்.",
        chatButton: "பாரதியாருடன் உரையாடல்",
        libraryButton: "நூலகம்",
      },
      features: {
        title: "தமிழ் இலக்கியத்தின் புதிய பயணம்",
        cards: [
          {
            title: "தமிழ் இலக்கிய ஆய்வு",
            description:
              "AI மூலம் தமிழ் இலக்கியங்களை ஆராய்ந்து புதிய கண்ணோட்டங்களைப் பெறுங்கள். பாரதியாரின் படைப்புகளின் ஆழ்ந்த பொருளை அறியும் வாய்ப்பு.",
          },
          {
            title: "கவிதை பரிந்துரைகள்",
            description:
              "உங்கள் ஆர்வத்திற்கேற்ப பாரதியாரின் கவிதைகளைக் கண்டறியுங்கள். AI உங்களுக்கான சிறந்த படைப்புகளை தேர்ந்தெடுக்கும்.",
          },
          {
            title: "சமூக உரையாடல்",
            description:
              "தமிழ் ஆர்வலர்களுடன் இணைந்து கருத்துக்களைப் பகிருங்கள். புதிய பார்வைகளையும், விளக்கங்களையும் பெறுங்கள்.",
          },
        ],
      },
    },
    english: {
      brand: "Deepதமிழ்",
      nav: {
        poems: "Poems",
        vision: "Vision",
      },
      hero: {
        title: "Tamil Language",
        subtitle: "A New Dimension",
        description:
          "Experience the depth of Tamil literature through AI-powered exploration of Bharathiar's works. Where modern technology meets traditional wisdom.",
        chatButton: "Chat with Bharathiar",
        libraryButton: "Library",
      },
      features: {
        title: "A New Journey in Tamil Literature",
        cards: [
          {
            title: "Literary Analysis",
            description:
              "Explore Tamil literature through AI and gain new perspectives. Discover the profound meaning behind Bharathiar's works.",
          },
          {
            title: "Poetry Recommendations",
            description:
              "Discover Bharathiar's poems based on your interests. Let AI curate the best works for you.",
          },
          {
            title: "Community Dialogue",
            description:
              "Connect with Tamil enthusiasts to share insights. Gain new perspectives and interpretations.",
          },
        ],
      },
    },
  };

  const currentContent = isEnglish ? content.english : content.tamil;

  const renderContent = () => {
    switch (activeSection) {
      case "poems":
        return <PoemsSection isEnglish={isEnglish} />;
      case "vision":
        return <VisionSection isEnglish={isEnglish} />;
      default:
        return (
          <>
            {/* Hero Content */}
            <div className="flex flex-col lg:flex-row items-center justify-between py-8 sm:py-12 lg:py-20 gap-8 lg:gap-12">
              <div className="lg:w-1/2 text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-amber-900 mb-4 sm:mb-6 leading-tight">
                  {currentContent.hero.title}
                  <br />
                  <span className="text-amber-600">
                    {currentContent.hero.subtitle}
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {currentContent.hero.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => setShowChatbot(true)}
                    className="bg-amber-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-amber-800 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
                  >
                    <Sparkles size={20} />
                    <span>{currentContent.hero.chatButton}</span>
                  </button>
                  <button
                    onClick={() => setActiveSection("poems")}
                    className="border-2 border-amber-700 text-amber-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-amber-50 transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Book size={20} />
                    <span>{currentContent.nav.poems}</span>
                  </button>
                </div>
              </div>
              <div className="lg:w-1/2 w-full max-w-lg lg:max-w-none mx-auto">
                <ChatInterface isEnglish={isEnglish} />
              </div>
            </div>

            {/* Features Section */}
            <div className="py-16 sm:py-24 px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-amber-900 mb-12 sm:mb-16 px-4">
                  {currentContent.features.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 px-4">
                  {currentContent.features.cards.map((card, index) => (
                    <div
                      key={index}
                      className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow transform hover:-translate-y-1 border border-amber-100"
                    >
                      {index === 0 && (
                        <ScrollText className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600 mb-4 sm:mb-6" />
                      )}
                      {index === 1 && (
                        <Moon className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600 mb-4 sm:mb-6" />
                      )}
                      {index === 2 && (
                        <Users className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600 mb-4 sm:mb-6" />
                      )}
                      <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-3 sm:mb-4">
                        {card.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50">
      {/* Hero Section */}
      <div className="relative min-h-screen">
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation */}
          <nav className="py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
              <span
                className="text-xl sm:text-2xl font-bold text-amber-900 cursor-pointer"
                onClick={() => setActiveSection("home")}
              >
                {currentContent.brand}
              </span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex gap-4 sm:gap-6 text-sm sm:text-base">
                <button
                  onClick={() => setActiveSection("poems")}
                  className={`text-amber-900 hover:text-amber-700 ${
                    activeSection === "poems"
                      ? "font-bold border-b-2 border-amber-600"
                      : ""
                  }`}
                >
                  {currentContent.nav.poems}
                </button>
                <button
                  onClick={() => setActiveSection("vision")}
                  className={`text-amber-900 hover:text-amber-700 ${
                    activeSection === "vision"
                      ? "font-bold border-b-2 border-amber-600"
                      : ""
                  }`}
                >
                  {currentContent.nav.vision}
                </button>
              </div>
              <button
                onClick={() => setIsEnglish(!isEnglish)}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 hover:bg-amber-200 transition-colors"
              >
                <span className="text-sm text-amber-900">
                  {isEnglish ? "தமிழ்" : "English"}
                </span>
              </button>
            </div>
          </nav>

          {renderContent()}
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-amber-50 to-transparent" />
      </div>

      {/* Fullscreen Chatbot */}
      {showChatbot && (
        <ChatbotFullscreen
          isEnglish={isEnglish}
          onClose={() => setShowChatbot(false)}
        />
      )}
    </div>
  );
}

export default App;
