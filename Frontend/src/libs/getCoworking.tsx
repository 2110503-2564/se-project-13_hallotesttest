export default async function getCoworking(id : string) {
    const response = await fetch(`https://deepseekxchatgpt-backend.vercel.app/api/v1/coworkings/${id}`);
    if(!response.ok) {
        throw new Error("Failed to fetch Coworkings");
    }

    return await response.json();
}