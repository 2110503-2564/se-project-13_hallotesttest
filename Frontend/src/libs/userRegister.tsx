export default async function userRegister(
    name: string,
    email: string,
    tel : string,
    password: string
  ) {
    const payload = {
      name,
      email,
      tel,
      password,
      role: "user" 
    };
  
    const response = await fetch("https://deepseekxchatgpt-backend.vercel.app/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  
    if (!response.ok) {
      throw new Error("Failed to register user");
    }
  
    return await response.json();
  }