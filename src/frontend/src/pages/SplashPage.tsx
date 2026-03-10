import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate({ to: "/login" });
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-organic-gradient flex items-center justify-center">
      <img
        src="/assets/uploads/file_00000000afac7208abab2d62179b0676-1-1-1.png"
        alt="CareerNest"
        className="w-72 h-auto object-contain drop-shadow-xl"
        onError={(e) => {
          const el = e.currentTarget;
          el.style.display = "none";
          const fallback = el.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = "flex";
        }}
      />
      <div className="hidden w-64 h-64 bg-primary/10 rounded-3xl items-center justify-center">
        <span className="text-primary font-serif font-bold text-8xl">CN</span>
      </div>
    </div>
  );
}
