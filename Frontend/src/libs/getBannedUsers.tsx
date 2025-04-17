// @/libs/getBannedUsers.tsx
export default async function getBannedUsers(token: string) {
  try {
    const response = await fetch(
      "https://se13-backend.vercel.app/api/v1/banned",
      {
        //  API endpoint to fetch banned users
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "Failed to fetch banned users. Please try again later."
      );
    }

    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
