export default async function createBooking(coworkingId: string, bookingDate: string, token: string) {
    const response = await fetch(`https://deepseekxchatgpt-backend.vercel.app/api/v1/coworkings/${coworkingId}/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        reservDate: bookingDate
      })
    });
  
    if (!response.ok) {
        const errorData = await response.json();
        
        if (errorData.message && errorData.message.includes('3 reservations')) {
            throw new Error("You've reached the maximum limit of 3 reservations. Please delete an existing reservation before booking a new one.");
        } 
        else if (errorData.message) {
            throw new Error(errorData.message);
        } else {
            throw new Error("Failed to create reservation. Please try again later.");
        }
    }
    return await response.json();
  }