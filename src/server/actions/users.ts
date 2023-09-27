const baseUrl = process.env.API_BASE_URL || "http://localhost:5001/";

async function getUserById(accessToken: string, userId: string) {
  try {
    const res = await fetch(`${baseUrl}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to get user");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function getMe(accessToken: string) {
  try {
    const res = await fetch(`${baseUrl}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Failed to get user");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export const userServices = {
  getUserById,
  getMe,
};
