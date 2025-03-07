import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

interface Props {
  isEnglish: boolean;
}

const poems = [
  {
    text: "இனியொரு விதிசெய் வோம் - அதை\nஎந்த நாளும் காப்போம்,\nதனியொரு வனுக் குணவிலை யெனில்\nஜகத்தினை அழித்திடு வோம்",
    translation:
      "Let us make a new rule - and\nProtect it every day,\nIf there is no food for one person\nWe shall destroy the world",
  },
  {
    text: "விசையுறு பந்தினைப்போல் — உள்ளம்\nவேண்டிய படிசெலும் உடல்கேட்டேன்,\nநசையறு மனங்கேட்டேன், — நித்தம்\nநவமெனச் சுடர்தரும் உயிர்கேட்டேன்,\nதசையினைத் தீச்சுடினும் — சிவ\nசக்தியைப் பாடும்நல் அகங்கேட்டேன்,\nஅசைவறு மதிகேட்டேன்; — இவை\nஅருள்வதில் உனக்கெதுந் தடையுளதோ?\n– மகாகவி பாரதியார்",
    translation:
      "Like a ball with momentum — I asked for\nA body that moves as the mind desires,\nI asked for a desireless mind, — daily\nI asked for a life that shines like new,\nEven if fire burns the flesh — I asked for\nA good heart that sings of Shiva Shakti,\nI asked for unwavering wisdom; — in granting these\nWhat obstacle do you have?",
  },
  {
    text: "கனவு மெய்ப்படவேண்டும்,\nகைவசமாவது விரைவில் வேண்டும்;\nதனமும் இன்பமும் வேண்டும்,\nதரணியிலே பெருமை வேண்டும்;",
    translation:
      "Dreams must come true,\nSuccess must come quickly;\nWealth and happiness are needed,\nGreatness in the world is needed;",
  },
  {
    text: "வள்ளுவன் தன்னை உலகினுக்கே – தந்து\nவான்புகழ் கொண்ட தமிழ்நாடு",
    translation:
      "Tamil Nadu gave Valluvan to the world – and\nGained heavenly fame",
  },
  {
    text: "நெஞ்சை\nஅள்ளும் சிலப்பதி காரமென்றோர் - மணி\nயாரம் படைத்த தமிழ்நாடு",
    translation:
      "Tamil Nadu created\nSilapathikaram, a jeweled\nNecklace that captures the heart",
  },
  {
    text: "யாமறிந்த மொழிகளிலே தமிழ்மொழிபோல் இனிதாவ தெங்குங் காணோம்\nநிமிர்ந்த நன்னடை நேர்கொண்ட பார்வையும், நிலத்தில் யார்க்கும் அஞ்சாத நெறிகளும், திமிர்ந்த ஞானச் செருக்கும் இருப்பதால் செம்மை மாதர் திறம்புவ தில்லையாம்",
    translation:
      "Among the languages we know, nowhere do we see one as sweet as Tamil\nWith upright gait, direct gaze, ways that fear none on earth, and filled with proud wisdom, the virtuous women never deviate",
  },
  {
    text: "என்னிது துணிச் கருமம் துணிந்தவன்\nஎன்னுவாம் என்பது இருக்கு (467)\n\nஎன்று திருக்குறளை அப்படியே உள்ளவாசிக்கக்கொண்ட\nமகாகவி பாரதியார்,\n\nஎன்னிது துணிவதுங் கருமம் - துணிந்து\nஏற்ற பின்னரின் பின்னுவம் இருக்கு என்ப\nபுனனியர் தமிழ்தோற்ற முதலிவன் சொன்ன\n\nஎனச் செய்யும் புலவர் இவ்வழி அருளிச் செய்து\nஇருக்குவதும் தமிழ்த்தொகை நுண்மதிதத்தது. திருக்குறளைப்\nபோற்றுவதற்குக் காரணமும் கூறுகிறார் மகாகவி.",
    translation:
      '"What is this resolute deed that the resolute one\nWill say" is in the Thirukkural (467)\n\nThus, Mahakavi Bharathiar, who read the Thirukkural exactly as it is,\n\n"What is this resolute deed - after resolving\nAnd accepting, later we will say" as they say\nThe first one who appeared in Tamil said\n\nThus the poet graciously composed in this way\nAnd it is the subtle intelligence of the Tamil collection. Mahakavi\nAlso states the reason for praising Thirukkural.',
  },
];

export default function PoemsSection({ isEnglish }: Props) {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <BookOpen className="w-12 h-12 text-amber-600 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold text-amber-900 mb-4">
            {isEnglish ? "Bharathiar's Poems" : "பாரதியாரின் கவிதைகள்"}
          </h2>
          <p className="text-lg text-gray-700">
            {isEnglish
              ? "Explore the timeless verses of Mahakavi Bharathiar"
              : "மகாகவி பாரதியாரின் காலத்தை வென்ற பாடல்களை ஆராயுங்கள்"}
          </p>
        </div>

        <div className="space-y-8">
          {poems.map((poem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.2,
                ease: "easeOut",
              }}
              className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-amber-100"
            >
              <div className="prose max-w-none">
                <div className="whitespace-pre-line text-lg font-medium text-amber-900">
                  {poem.text}
                </div>
                {isEnglish && (
                  <div className="mt-4 text-gray-600 italic">
                    {poem.translation}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
