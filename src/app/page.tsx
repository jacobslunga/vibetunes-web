import Header from "@/components/Auth/Header";
import SignInButton from "@/components/Auth/SignInButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/util/authOptions";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/playlists");
  }

  return (
    <main className="flex min-h-screen bg-white dark:bg-dark_bg flex-col items-center justify-center">
      <Header />

      <h1 className="text-5xl font-black max-w-[80%] text-center text-black dark:text-white mt-10">
        Introducing the mood based music player.{" "}
        <span className="text-primary dark:text-white underline">
          VibeTunes
        </span>{" "}
        for GenZ
      </h1>

      <SignInButton />
    </main>
  );
}
