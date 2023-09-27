"use client";

import { FC } from "react";
import { signIn } from "next-auth/react";

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  const handleSignIn = () => {
    signIn("spotify", {
      redirect: true,
      callbackUrl: "http://localhost:3000/playlists",
    });
  };

  return (
    <div className="flex px-10 fixed flex-row w-screen h-16 top-0 border-b-2 border-b-gray-200 dark:border-b-[rgba(255,255,255,0.1)] items-center justify-between bg-white dark:bg-dark_bg">
      <h1 className="text-black tracking-tight dark:text-white font-bold select-none">
        VibeTunes 🌈
      </h1>
      <button
        onClick={handleSignIn}
        className="rounded-md transition-colors duration-200 p-2 text-sm border-2 border-black dark:border-white dark:hover:border-transparent hover:border-transparent hover:bg-spotify dark:hover:text-black hover:text-black dark:text-white text-black font-semibold"
      >
        Login with Spotify
      </button>
    </div>
  );
};

export default Header;
