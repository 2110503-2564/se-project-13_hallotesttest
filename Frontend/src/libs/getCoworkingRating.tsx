export default async function getCoworkingRating(cid : string) {
    if(!cid) {
        throw new Error("Coworking ID is required.");
    }
    const response = await fetch(`https://se13-backend.vercel.app/api/v1/coworkings/${cid}/reviews`, {
        method : "GET",
        headers : {
            "Content-Type" : "application/json",
        }
    });
    if(!response.ok) {
        throw new Error("Failed to fetch Coworking Ratings");
    }
    return await response.json();
}