export default async function createRating({rating, comment, token, cid}: {rating: number, comment : string, token: string, cid : string}) {

    if(rating <= 0 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
    }

  const formData = {
    rating: rating,
    comment: comment,
  }
  const res = await fetch(`https://se13-backend.vercel.app/api/v1/coworkings/${cid}/reviews`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to create Rating");
  }
  
  return await res.json();

}