export default async function editReview(rid : string, rating : number, comment : string, token : string) {
    if(!rid) {
        throw new Error("Review ID is required.");
    }

    if(!rating) {
        throw new Error("Rating is required.");
    }

    if(rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5.");
    }

    const response = await fetch(`https://se13-backend.vercel.app/api/v1/reviews/${rid}`, {
        method : "PUT",
        headers : {
            "Content-Type" : "application/json",
            authorization: `Bearer ${token}`
        },
        body : JSON.stringify({
            rating : rating,
            comment : comment,
        }),
    });
    if(!response.ok) {
        throw new Error("Failed to edit review.");
    }
    return await response.json();
}