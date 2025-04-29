export default async function getCoworkingStat(cid : string) {
    if(!cid) {
        throw new Error("Coworking ID is required.");
    }
    const response = await fetch(`https://se13-backend.vercel.app/api/v1/stats/${cid}`, {
        method : "GET",
    });
    if(!response.ok) {
        throw new Error("Failed to fetch Coworking Statistics.");
    }
    return await response.json();
}