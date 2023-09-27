import { authOptions } from "@/lib/util/authOptions";
import { userServices } from "@/server/actions/users";
import { getServerSession } from "next-auth";
import { FC } from "react";

interface PlaylistsProps {}

const Playlists: FC<PlaylistsProps> = async ({}) => {
  const session: any = await getServerSession(authOptions);

  console.log(session);

  const user = await userServices.getMe(session.vibeTunesAccessToken);

  console.log(user);

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-white dark:bg-dark_bg flex flex-col items-center justify-center"></div>
  );
};

export default Playlists;
