import React, { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { SiteContent } from "./Chat";
import { processHtmlContent } from "@/app/utils/processHtmlContent";
import { Button } from "./ui/button";
import { IoArrowUpCircle } from "react-icons/io5";
type Props = {
  setSiteContent: React.Dispatch<React.SetStateAction<SiteContent>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  closeChat: any;
};

const RequestForm: React.FC<Props> = ({
  setSiteContent,
  setIsLoading,
  isLoading,
  closeChat,
}) => {
  const [siteUrl, setSiteUrl] = useState("");
  const [error, setError] = useState("");
  const { user } = useUser();
  const { openSignUp } = useClerk();

  const scrapeSite = async (url: string) => {
    const response = await fetch(`/api/scrapper`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
    const responseData = await response.json();
    const textContent = processHtmlContent(responseData.textContent);
    setSiteContent({ content: textContent, url });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      openSignUp();
      return;
    }

    setError("");
    setIsLoading(true);
    setSiteContent({ url: "", content: "" });

    try {
      await scrapeSite(siteUrl);
    } catch (error) {
      setError("There was an error reading the site. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        className="w-[80%] md:w-[60%] flex justify-center items-center p-4 bg-black border-[1px] rounded-3xl  bg-opacity-50 backdrop-blur-xl  "
        onSubmit={onSubmit}
      >
        <div className="input-group">
          <input
            className="inputStyle bg-neutral-900"
            name="url-input"
            type="url"
            placeholder="Drop the url here"
            required
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
          />
        </div>
        {isLoading ? (
          <div className="loadingContainer">
            <div className="loadingSpinner"></div>
          </div>
        ) : (
          <div>
            <Button className=" buttonStyle" type="submit">
              <IoArrowUpCircle className="!w-6 !h-6 " />
            </Button>
          </div>
        )}
        {error && <p className="errorMessage">{error}</p>}
      </form>
      <button
        onClick={closeChat}
        className=" font-bold text-white text-center mt-2"
      >
        Exit <span className="font-light text-xs"> or click on Esc </span>
      </button>
    </>
  );
};

export default RequestForm;
