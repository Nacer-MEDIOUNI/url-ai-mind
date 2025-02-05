import React, { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useUser, useClerk } from "@clerk/nextjs";
import { useChat } from "ai/react";
import { getSitePrompt } from "@/app/utils/getSitePrompt";
import MarkdownRenderer from "./MarkdownRenderer";
import { Button } from "./ui/button";
import { IoArrowUpCircle } from "react-icons/io5";

export type SiteContent = {
  url: string;
  content: string;
};
type ChatProps = {
  siteContent: SiteContent;
  closeChat: any;
};

const Chat: React.FC<ChatProps> = ({ closeChat, siteContent }) => {
  const chatContainer = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    initialMessages: getSitePrompt(siteContent),
  });

  const { user } = useUser();
  const { openSignUp } = useClerk();

  const scroll = useCallback(() => {
    const { offsetHeight, scrollHeight, scrollTop } =
      chatContainer.current as HTMLDivElement;
    if (scrollHeight >= scrollTop + offsetHeight) {
      chatContainer.current?.scrollTo?.(0, scrollHeight + 200);
    }
  }, []);

  useEffect(() => {
    scroll();
  }, [messages, scroll]);

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!user) {
        openSignUp();
        return;
      }

      await handleSubmit(event);
    },
    [user, openSignUp, handleSubmit]
  );

  const renderResponse = useCallback(() => {
    return (
      <div ref={chatContainer} className="response scroll-box">
        {messages.map((m, index) => {
          if (index === 0 || (m.role !== "user" && m.role !== "assistant")) {
            return null;
          }
          return (
            <div
              key={index}
              className={`chat-line ${
                m.role === "user" ? "user-chat" : "ai-chat"
              }`}
            >
              <Image
                className="avatar"
                alt=""
                src={`/${m.role}.webp`}
                width={32}
                height={32}
              />
              <div>
                <div className="message">
                  <MemoizedMarkdownRenderer>
                    {m.content}
                  </MemoizedMarkdownRenderer>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [messages]);

  const MemoizedMarkdownRenderer = React.memo(MarkdownRenderer);

  return (
    <div className="chat">
      {renderResponse()}
      <form
        className="w-full flex justify-center items-center p-4 bg-black border-[1px] rounded-3xl  bg-opacity-50 backdrop-blur-xl  "
        onSubmit={onSubmit}
      >
        <div className="input-group">
          <input
            className="inputStyle bg-neutral-900"
            name="input-field"
            type="text"
            placeholder="Ask anything about the site"
            onChange={handleInputChange}
            value={input}
          />
        </div>

        <div>
          <Button className=" buttonStyle" type="submit">
            <IoArrowUpCircle className="!w-6 !h-6 " />
          </Button>
        </div>
      </form>
      <button
        onClick={closeChat}
        className="font-bold text-white text-center mt-2"
      >
        Exit <span className="font-light text-xs"> or click on Esc </span>
      </button>
    </div>
  );
};

export default Chat;
