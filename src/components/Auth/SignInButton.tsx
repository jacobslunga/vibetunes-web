"use client";

import { FC } from "react";
import { signIn } from "next-auth/react";

interface SignInButtonProps {}

const SignInButton: FC<SignInButtonProps> = ({}) => {
  const handleSignIn = () => {
    signIn("spotify", {
      redirect: true,
      callbackUrl: "http://localhost:3000/playlists",
    });
  };

  return (
    <button
      onClick={handleSignIn}
      className="rounded-md transition-colors duration-200 p-2 text-sm border-2 border-black dark:border-white dark:hover:border-transparent hover:border-transparent hover:bg-spotify dark:hover:text-black hover:text-black dark:text-white text-black font-semibold mt-10"
    >
      Continute with Spotify
    </button>
  );
};

export default SignInButton;
