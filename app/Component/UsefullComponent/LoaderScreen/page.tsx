// components/LoaderScreen.tsx
"use client";
import { useEffect, useState } from "react";
import { ShoppingBag, Sparkles, Heart, Star } from "lucide-react";

interface LoaderScreenProps {
  onLoadingComplete?: () => void;
  isLoading?: boolean;
}

export default function LoaderScreen({
  onLoadingComplete,
  isLoading = true,
}: LoaderScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    // Only start progress if still loading
    if (!isLoading) {
      // Complete progress
      setProgress(100);

      // Start fade out animation
      setTimeout(() => {
        setScale(0.95);
        setFadeOut(true);

        // Call onLoadingComplete after animation
        setTimeout(() => {
          onLoadingComplete?.();
        }, 800);
      }, 200);

      return;
    }

    // Simulate progress while loading
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 8;
      });
    }, 150);

    return () => clearInterval(progressInterval);
  }, [isLoading, onLoadingComplete]);

  if (!isLoading && !fadeOut) {
    return null;
  }

  return (
    <>
      {/* Overlay with blur effect */}
      <div
        className={`fixed inset-0 z-[9999] transition-all duration-1000 ease-out ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white" />

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-gray-100/50 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-gray-100/50 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Main Content */}
        <div
          className={`relative h-full flex items-center justify-center transition-all duration-800 ease-out ${
            fadeOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
          style={{ transitionDuration: "800ms" }}
        >
          <div className="text-center px-4">
            {/* Main Logo Container */}
            <div className="relative mb-10">
              {/* Outer Ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-2 border-gray-200 animate-ping opacity-30" />
              </div>

              {/* Rotating Ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full border-t-2 border-gray-800 animate-spin" />
              </div>

              {/* Center Icon */}
              <div className="relative bg-white rounded-full w-24 h-24 mx-auto flex items-center justify-center shadow-lg">
                <ShoppingBag
                  className="w-12 h-12 text-gray-800"
                  strokeWidth={1.5}
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-2 -right-2 animate-bounce">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <div className="absolute -bottom-2 -left-2 animate-bounce delay-150">
                <Heart className="w-5 h-5 text-rose-400" />
              </div>
              <div className="absolute top-1/2 -right-8 animate-pulse delay-300">
                <Star className="w-4 h-4 text-amber-300" />
              </div>
              <div className="absolute top-1/3 -left-8 animate-pulse delay-500">
                <Star className="w-3 h-3 text-amber-300" />
              </div>
            </div>

            {/* Brand Name */}
            <h1
              className="text-4xl md:text-5xl font-light text-gray-900 mb-3 tracking-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Karim5
            </h1>
            <p className="text-gray-400 text-sm mb-10 tracking-wide">
              Premium Quality Products
            </p>

            {/* Progress Bar */}
            <div className="w-72 mx-auto mb-4">
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gray-700 to-gray-900 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>

            {/* Progress Percentage */}
            <p className="text-xs text-gray-400 font-mono mb-6">
              {Math.floor(Math.min(progress, 100))}%
            </p>

            {/* Loading Message with Dots */}
            <div className="flex items-center justify-center gap-1 text-gray-400 text-sm">
              <span>Loading</span>
              <span className="animate-bounce delay-0">.</span>
              <span className="animate-bounce delay-150">.</span>
              <span className="animate-bounce delay-300">.</span>
            </div>

            {/* Decorative Dots */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-pulse"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add style to prevent body scroll during loader */}
      <style jsx global>{`
        body {
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
