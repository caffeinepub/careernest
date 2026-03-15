import { type ReactNode, createContext, useContext, useState } from "react";

export type Language = "en" | "hi" | "mr";

const translations = {
  en: {
    appName: "CareerNest",
    tagline: "Maharashtra's smart academic & career platform for students",
    dashboard: "Dashboard",
    studyNotes: "Study Notes",
    textbooks: "Textbooks",
    aiAssistant: "AI Study Assistant",
    uploadNotes: "Upload Notes",
    career: "Career Guidance",
    quiz: "Quiz & Assessments",
    papers: "Question Papers",
    planner: "Study Planner",
    wellness: "Wellness Resources",
    games: "Stress Relief Games",
    login: "Login / Sign Up",
    logout: "Logout",
    submit: "Submit",
    save: "Save",
    cancel: "Cancel",
    language: "Language",
    welcome: "Welcome back",
    selectClass: "Select your class",
    selectStream: "Select your stream",
    generateNotes: "Generate Notes",
    startQuiz: "Start Quiz",
    viewPaper: "View Paper",
    download: "Download",
    like: "Like",
    upload: "Upload",
    search: "Search",
    filter: "Filter",
  },
  hi: {
    appName: "CareerNest",
    tagline: "महाराष्ट्र के छात्रों के लिए स्मार्ट शैक्षणिक और करियर प्लेटफॉर्म",
    dashboard: "डैशबोर्ड",
    studyNotes: "अध्ययन नोट्स",
    textbooks: "पाठ्यपुस्तकें",
    aiAssistant: "AI अध्ययन सहायक",
    uploadNotes: "नोट्स अपलोड करें",
    career: "करियर मार्गदर्शन",
    quiz: "प्रश्नोत्तरी और मूल्यांकन",
    papers: "प्रश्न पत्र",
    planner: "अध्ययन योजनाकार",
    wellness: "स्वास्थ्य संसाधन",
    games: "तनाव राहत खेल",
    login: "लॉगिन / साइन अप",
    logout: "लॉगआउट",
    submit: "जमा करें",
    save: "सहेजें",
    cancel: "रद्द करें",
    language: "भाषा",
    welcome: "वापस स्वागत है",
    selectClass: "अपनी कक्षा चुनें",
    selectStream: "अपनी धारा चुनें",
    generateNotes: "नोट्स जेनरेट करें",
    startQuiz: "प्रश्नोत्तरी शुरू करें",
    viewPaper: "पेपर देखें",
    download: "डाउनलोड",
    like: "पसंद",
    upload: "अपलोड",
    search: "खोजें",
    filter: "फ़िल्टर",
  },
  mr: {
    appName: "CareerNest",
    tagline: "महाराष्ट्रातील विद्यार्थ्यांसाठी स्मार्ट शैक्षणिक आणि करिअर प्लॅटफॉर्म",
    dashboard: "डॅशबोर्ड",
    studyNotes: "अभ्यास नोट्स",
    textbooks: "पाठ्यपुस्तके",
    aiAssistant: "AI अभ्यास सहाय्यक",
    uploadNotes: "नोट्स अपलोड करा",
    career: "करिअर मार्गदर्शन",
    quiz: "प्रश्नमंजुषा आणि मूल्यमापन",
    papers: "प्रश्नपत्रिका",
    planner: "अभ्यास नियोजक",
    wellness: "निरोगी संसाधने",
    games: "तणाव निवारण खेळ",
    login: "लॉगिन / साइन अप",
    logout: "लॉगआउट",
    submit: "सबमिट करा",
    save: "जतन करा",
    cancel: "रद्द करा",
    language: "भाषा",
    welcome: "परत स्वागत",
    selectClass: "तुमची इयत्ता निवडा",
    selectStream: "तुमची शाखा निवडा",
    generateNotes: "नोट्स तयार करा",
    startQuiz: "प्रश्नमंजुषा सुरू करा",
    viewPaper: "पेपर पहा",
    download: "डाउनलोड",
    like: "आवडले",
    upload: "अपलोड",
    search: "शोधा",
    filter: "फिल्टर",
  },
};

type Translations = typeof translations.en;

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const saved = (localStorage.getItem("careernest_lang") as Language) || "en";
  const [lang, setLangState] = useState<Language>(saved);

  const setLang = (l: Language) => {
    localStorage.setItem("careernest_lang", l);
    setLangState(l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex gap-1">
      {(["en", "hi", "mr"] as Language[]).map((l) => (
        <button
          type="button"
          key={l}
          onClick={() => setLang(l)}
          data-ocid={`lang.${l}.toggle`}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
            lang === l
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
