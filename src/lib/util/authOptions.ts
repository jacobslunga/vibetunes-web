import { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { spotifyApi } from "../spotify/spotifyApi";

const baseURL = process.env.API_BASE_URL as string;

async function refreshVibeTunesToken(refresh_token: string) {
  const res = await fetch(`${baseURL}/users/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh_token,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to refresh token");
  }

  return await res.json();
}

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ account, user }: { account: any; user: any }) {
      if (!account) {
        return false;
      }

      spotifyApi.setAccessToken(account.access_token);

      const me = await spotifyApi.getMe();
      console.log("Me", me);

      const res = await fetch(`${baseURL}/users/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: me.body.display_name,
          imageUrl: me.body.images ? me.body.images[0].url : null,
          email: me.body.email,
          spotifyUrl: me.body.external_urls.spotify,
          spotifyId: me.body.id,
        }),
      });

      if (!res.ok) {
        return false;
      }

      const data = await res.json();

      (user as any).vibeTunesAccessToken = data.vibeTunesAccessToken;
      (user as any).vibeTunesRefreshToken = data.vibeTunesRefreshToken;
      (user as any).vibeTunesExpiresAt = data.vibeTunesExpiresAt;

      return true;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.spotifyAccessToken = token.spotifyAccessToken;
      session.spotifyRefreshToken = token.spotifyRefreshToken;
      session.spotifyExpiresAt = token.spotifyExpiresAt;
      session.vibeTunesAccessToken = token.vibeTunesAccessToken;
      session.vibeTunesRefreshToken = token.vibeTunesRefreshToken;
      session.vibeTunesExpiresAt = token.vibeTunesExpiresAt;
      session.id = token.id;
      return session;
    },
    async jwt({ token, user, account }: { [key: string]: any }) {
      if (account && user) {
        token.spotifyAccessToken = account.access_token;
        token.spotifyRefreshToken = account.refresh_token;
        token.spotifyExpiresAt = account.expires_at;
        token.id = user.id;
        token.vibeTunesAccessToken = user.vibeTunesAccessToken;
        token.vibeTunesRefreshToken = user.vibeTunesRefreshToken;
        token.vibeTunesExpiresAt = user.vibeTunesExpiresAt;
      }

      spotifyApi.setAccessToken(token.spotifyAccessToken);
      spotifyApi.setRefreshToken(token.spotifyRefreshToken);

      if (Math.floor(Date.now() / 1000) > token.spotifyExpiresAt) {
        try {
          const refresh = await spotifyApi.refreshAccessToken();
          token.spotifyAccessToken = refresh.body.access_token;
          token.spotifyExpiresAt = Math.floor(Date.now() / 1000) + 3600;

          spotifyApi.setAccessToken(refresh.body.access_token);
        } catch (err) {
          console.log(err);
        }
      }

      if (
        Math.floor(Date.now()) > token.vibeTunesExpiresAt &&
        token.vibeTunesRefreshToken
      ) {
        try {
          const { accessToken, expiresAt } = await refreshVibeTunesToken(
            token.vibeTunesRefreshToken
          );
          token.vibeTunesAccessToken = accessToken;
          token.vibeTunesExpiresAt = expiresAt;
        } catch (err) {
          console.log(err);
        }
      }

      return token;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
};
