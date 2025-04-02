export default async function getBooking(token: string) {
    const response = await fetch("https://deepseekxchatgpt-backend.vercel.app/api/v1/reservations", {
        method: "GET",
        headers: {
            authorization: `Bearer ${token}`,
        },
    });
    
    if (!response.ok) {
        throw new Error("Failed to fetch reservations");
    }
    
    return await response.json();
}