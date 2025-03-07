import { motion } from "framer-motion";
import { Eye, Mail, Linkedin } from "lucide-react";

interface Props {
  isEnglish: boolean;
}

export default function VisionSection({ isEnglish }: Props) {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Eye className="w-12 h-12 text-amber-600 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold text-amber-900 mb-4">
            {isEnglish ? "Our Vision" : "எங்கள் நோக்கம்"}
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-lg border border-amber-100"
        >
          <div className="prose max-w-none">
            <p className="text-lg text-gray-800 mb-6">
              {isEnglish
                ? '"The essence of arts in Tamil" - as Bharathiar said, DeepTamil. I am Nandhini, and I\'m delighted to see you at DeepTamil. I extend my love for Tamil to all through technology. Your message is valuable to me.'
                : '"மேன்மை கலைகள் தமிழினில்" என பாரதியார் சொன்ன பொருளை Deepதமிழ். நான் நந்தினி, உங்களை Deepதமிழில் பார்ப்பதில் மகிழ்ச்சி. தொழில்நுட்பத்தின் மூலம் தமிழ் மீதான எனது அன்பை அனைவருக்கும் விரிவுபடுத்துகிறேன். உங்கள் செய்தி எனக்கு மிகவும் மதிப்புமிக்கது.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
              <a
                href="mailto:deeptamilai@gmail.com"
                className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 rounded-lg text-amber-900 transition-colors"
              >
                <Mail size={18} />
                <span>deeptamilai@gmail.com</span>
              </a>

              <a
                href="https://www.linkedin.com/in/nandhini25/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 rounded-lg text-amber-900 transition-colors"
              >
                <Linkedin size={18} />
                <span>linkedin.com/in/nandhini25</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
