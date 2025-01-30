import "./globals.css";
import type { Metadata } from "next";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "URLMind",
  description: "Interacting with websites via AI Agent",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <header className=" absolute top-0 w-full py-4 px-8 flex justify-end items-center bg-transparent">
          <div className="flex space-x-4 justify-center items-center">
            <SignedIn>
              <UserButton
                appearance={{ baseTheme: dark }}
                afterSignOutUrl="/"
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="text-white border border-white hover:text-white  py-2 px-4 rounded-xl transition duration-300 ease-in-out">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className=" py-2 px-4 rounded-xl transition duration-300 ease-in-out">
                  Sign up
                </Button>
              </SignUpButton>
            </SignedOut>
          </div>
        </header>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
