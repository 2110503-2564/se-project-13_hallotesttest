// @/libs/banUser.tsx
export async function banUser(userId: string, token: string) {
  const response = await fetch(
    `https://deepseekxchatgpt-backend.vercel.app/api/v1/banned/${userId}`,
    {
      // Replace with your API endpoint to ban user
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    if (errorData.message) {
      throw new Error(errorData.message);
    } else {
      throw new Error("Failed to ban user. Please try again later.");
    }
  }

  return await response.json();
}

export async function unbanUser(userId: string, token: string) {
  const response = await fetch(
    `https://deepseekxchatgpt-backend.vercel.app/api/v1/banned/${userId}`,
    {
      // Replace with your API endpoint to unban user
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    if (errorData.message) {
      throw new Error(errorData.message);
    } else {
      throw new Error("Failed to unban user. Please try again later.");
    }
  }

  return await response.json();
}
