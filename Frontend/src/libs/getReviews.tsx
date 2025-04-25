export default async function getReviews(cid: string) {
    const res = await fetch(`https://se13-backend.vercel.app/api/v1/coworkings/${cid}/reviews`,{
        method : 'GET',
        headers : {
            'Content-Type' : 'application/json',
        }
    });

    if(!res.ok){
        throw new Error('Failed to fetch reviews');
    }
    return await res.json();
}