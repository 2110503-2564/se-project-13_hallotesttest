export default async function deleteReview(rid : string, token : string) {
    if(!rid) {
        throw new Error("Review ID is required.");
    }

    const response = await fetch(`https://se13-backend.vercel.app/api/v1/reviews/${rid}`, {
        method : "DELETE",
        headers : {
            "Content-Type" : "application/json",
            authorization: `Bearer ${token}`
        },
    });
    if(!response.ok) {
        throw new Error("Failed to delete review.");
    }
    return await response.json();
}