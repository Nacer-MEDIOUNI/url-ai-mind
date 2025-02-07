"use client";

import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { useClerk, useUser } from "@clerk/clerk-react"; // Import Clerk hooks
import Chat from "@/components/Chat";
import RequestForm from "@/components/RequestForm";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const chatOpenAudio = useRef(new Howl({ src: ["/on.mp3"] }));
  const chatCloseAudio = useRef(new Howl({ src: ["/off.mp3"] }));
  const [isLoading, setIsLoading] = useState(false);
  const [siteContent, setSiteContent] = useState({ url: "", content: "" });
  const { user } = useUser(); // Get user info
  const { openSignIn } = useClerk(); // Clerk's method to open the sign-in page

  const instructions = siteContent.content?.trim()
    ? "Feel free to ask anything you`d like about the site"
    : "Enter the site you want to chat with";

  const handleChatOpen = () => {
    if (!user) {
      // If the user is not authenticated, redirect to the Clerk login page
      openSignIn();
      return; // Prevent further action if the user is not authenticated
    }

    setIsOpen(true);
    chatOpenAudio.current.play();
  };

  const handleChatClose = () => {
    setIsOpen(false);
    chatCloseAudio.current.play();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        chatCloseAudio.current.play();
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const chatContainerRef = useRef<HTMLDivElement | null>(null); // Type the ref to be a HTMLDivElement or null

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatContainerRef.current &&
        !chatContainerRef.current.contains(event.target as Node) // Explicit type assertion to Node
      ) {
        chatCloseAudio.current.play();
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    gsap.to("#hero", {
      opacity: 1,
      y: -20,
      duration: 1,
      ease: "power4.out",
    });

    gsap.to("#cta", {
      opacity: 1,

      duration: 0.3,
      ease: "",
      delay: 0.5, // Add a delay to start the animation a bit later
    });
  }, []);

  return (
    <main className="App">
      <div className="w-full flex flex-col items-center justify-start mt-20  lg:justify-center lg:mt-8 py-2">
        <div className="flex flex-col items-center justify-center">
          <h1
            id="hero"
            className="text-4xl lg:text-6xl font-bold mx-[10%] lg:mt-20 opacity-0"
          >
            Interacting with websites via AI Agent
          </h1>
          <Button
            id="cta"
            onClick={handleChatOpen}
            className="glow-button opacity-0 animate-pulse-[10] hover:animate-none  text-base font-bold mt-6 lg:mt-20 text-white border border-white hover:text-white py-2 px-4 rounded-xl transition duration-300 ease-in-out"
          >
            Get Started
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5868AE] opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-[#5868AE]"></span>
            </span>
          </Button>
          {/* Chatbot container */}
          <div
            className={`fixed inset-0 flex justify-center items-end bg-black bg-opacity-50 backdrop-blur-md transition-opacity duration-300 ease-in-out ${
              isOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            {/* Overlay */}
            {isOpen && (
              <div className="fixed mt-4 inset-0" onClick={handleChatClose} />
            )}
            <div
              ref={chatContainerRef}
              className="bg-black/80 shadow-slate-100 shadow-lg w-full h-full  flex flex-col overflow-hidden z-20 justify-center items-center"
            >
              <div className=" relative w-full h-full flex flex-col items-center justify-center">
                <p className="instructions-text !mx-4">{instructions}</p>
                {siteContent.content ? (
                  <Chat closeChat={handleChatClose} siteContent={siteContent} />
                ) : (
                  <RequestForm
                    setIsLoading={setIsLoading}
                    setSiteContent={setSiteContent}
                    isLoading={isLoading}
                    closeChat={handleChatClose}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
