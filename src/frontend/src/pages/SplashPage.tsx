import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const LOGO_SRCS = [
  "/assets/uploads/file_00000000afac7208abab2d62179b0676-1-1-1.png",
  "/assets/uploads/file_00000000afac7208abab2d62179b0676-1--1.png",
  "/assets/uploads/file_00000000afac7208abab2d62179b0676-1--2.png",
  "/assets/generated/careernest-logo.dim_400x400-transparent.png",
];

export default function SplashPage() {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);
  const [logoIndex, setLogoIndex] = useState(0);
  const [allFailed, setAllFailed] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 2000);
    const t2 = setTimeout(() => navigate({ to: "/login" }), 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [navigate]);

  const handleLogoError = () => {
    if (logoIndex + 1 < LOGO_SRCS.length) {
      setLogoIndex(logoIndex + 1);
    } else {
      setAllFailed(true);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center transition-opacity duration-500 ${
        fade ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="animate-pulse flex flex-col items-center">
        {!allFailed ? (
          <img
            src={LOGO_SRCS[logoIndex]}
            alt="CareerNest"
            className="w-64 h-64 object-contain drop-shadow-2xl"
            onError={handleLogoError}
          />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <span className="text-white font-serif font-bold text-5xl">
                CN
              </span>
            </div>
            <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CareerNest
            </h1>
          </div>
        )}
      </div>
      <div className="mt-8 flex gap-2">
        <div
          className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
