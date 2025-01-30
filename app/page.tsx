"use client";

import { Button } from "@/components/ui/button";
import Chatbot from "@/components/chatbot";
export default function Home() {
  return (
    <main className="App">
      <div className="w-full flex flex-col items-center justify-center min-h-screen py-2">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold mt-10">
            Interacting with websites via AI Agent
          </h1>
          <Button className="mt-10 text-white border border-white hover:text-white  py-2 px-4 rounded-xl transition duration-300 ease-in-out">
            Get Started
          </Button>
        </div>
      </div>
    </main>
  );
}
