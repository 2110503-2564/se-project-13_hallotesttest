export default async function createCoworkingSpace(form: CoworkingItem, token: string) {
  // Remove _id if it's an empty string or not needed
  const { _id, ...formData } = form;
  
  const res = await fetch("https://deepseekxchatgpt-backend.vercel.app/api/v1/coworkings", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to create CoWorking space");
  }
  
  return await res.json();
}