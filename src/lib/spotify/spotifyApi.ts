import SpotifyWebApi from "spotify-web-api-node";

const clientId = process.env.SPOTIFY_CLIENT_ID as string;
const clientSecret = process.env.SPOTIFY_SECRET_ID as string;

export const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
  redirectUri: "http://localhost:3000/api/auth/callback/spotify",
});
