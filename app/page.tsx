"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { useClerk, useUser } from "@clerk/clerk-react"; // Import Clerk hooks
import Chat from "@/components/Chat";
import RequestForm from "@/components/RequestForm";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const chatOpenAudio = useRef(new Howl({ src: ["/on.mp3"] }));
  const chatCloseAudio = useRef(new Howl({ src: ["/off.mp3"] }));
  const [isLoading, setIsLoading] = useState(false);
  const [siteContent, setSiteContent] = useState({ url: "", content: "" });
  const { user, isLoaded } = useUser(); // Get user info
  const { openSignIn } = useClerk(); // Clerk's method to open the sign-in page

  const instructions = siteContent.content?.trim()
    ? "Ask any questions you want about the site"
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
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        chatCloseAudio.current.play();
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatContainerRef.current &&
        !chatContainerRef.current.contains(event.target)
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

  return (
    <main className="App">
      <div className="w-full flex flex-col items-center justify-center min-h-screen py-2">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold mt-10">
            Interacting with websites via AI Agent
          </h1>
          <Button
            onClick={handleChatOpen}
            className="mt-10 text-white border border-white hover:text-white py-2 px-4 rounded-xl transition duration-300 ease-in-out"
          >
            Get Started
          </Button>
          {/* Chatbot container */}
          <div
            className={`fixed inset-0 flex justify-center items-end bg-black bg-opacity-50 backdrop-blur-md transition-opacity duration-300 ease-in-out ${
              isOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            {/* Overlay */}
            {isOpen && (
              <div className="fixed inset-0" onClick={handleChatClose} />
            )}
            <div
              ref={chatContainerRef}
              className="bg-black/80 shadow-slate-100 shadow-lg w-fit h-full  flex flex-col overflow-hidden z-20 justify-center items-center"
            >
              <div className="form-wrapper">
                <p className="instructions-text">{instructions}</p>
                {siteContent.content ? (
                  <Chat siteContent={siteContent} />
                ) : (
                  <RequestForm
                    setIsLoading={setIsLoading}
                    setSiteContent={setSiteContent}
                    isLoading={isLoading}
                  />
                )}
              </div>

              <button
                onClick={handleChatClose}
                className="absolute top-4 right-4 text-black hover:text-gray-700"
              >
                Close
              </button>
              {/* Chatbot content goes here */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
