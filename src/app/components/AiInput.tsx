"use client";
import { useState, useEffect } from "react";
import { SparklesIcon } from "./icons/SparklesIcon";
import { SearchIcon } from "./icons/SearchIcon";

interface AiInputProps {
  className?: string;
  onSubmit: (query: string) => void;
}

export const AiInput = ({ className = "", onSubmit }: AiInputProps) => {
  const [placeholder, setPlaceholder] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [query, setQuery] = useState("");
  
  const phrases = [
    "Cerebro, how is my portfolio doing?",
    "Cerebro, should I invest more here?"
  ];
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isTyping) {
      // Typing animation
      const currentPhrase = phrases[currentStep % phrases.length];
      
      if (placeholder.length < currentPhrase.length) {
        // Still typing the current phrase
        timeout = setTimeout(() => {
          setPlaceholder(currentPhrase.slice(0, placeholder.length + 1));
        }, 60);
      } else {
        // Finished typing, wait before starting to delete
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      // Deleting animation
      if (placeholder.length > "Cerebro, ".length) {
        // Delete text after "Cerebro, "
        timeout = setTimeout(() => {
          setPlaceholder(placeholder.slice(0, placeholder.length - 1));
        }, 50);
      } else {
        // Move to the next phrase and start typing again
        setCurrentStep(currentStep + 1);
        setIsTyping(true);
      }
    }
    
    return () => clearTimeout(timeout);
  }, [placeholder, isTyping, currentStep, phrases]);
  
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SparklesIcon />
      </div>
      <input 
        type="text" 
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#776FCB]/20 focus:border-[#776FCB] ${className}`}
      />
      <button
        onClick={() => {
          onSubmit(query)
          setQuery("")
        }}
        className="absolute m-[0.5] inset-y-0 right-0 flex items-center bg-brandPurple text-white font-semibold py-2 px-5 rounded-full hover:bg-brandPurple/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brandPurple/50 focus:ring-offset-2"
      >
        <SearchIcon className="w-5 h-5" />
      </button>
    </div>
  );
}; 