export default async function getCoworkings() {
    const response = await fetch('https://se13-backend.vercel.app/api/v1/coworkings');
    if (!response.ok) {
      throw new Error("Failed to fetch Coworkings");
    }
    return await response.json();
  }