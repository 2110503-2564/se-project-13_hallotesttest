export default async function editBooking(reservationId: string, bookingDate: string, coworkingId: string, token: string) {
    const response = await fetch(`https://deepseekxchatgpt-backend.vercel.app/api/v1/reservations/${reservationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        reservDate: bookingDate,
        coWorking: coworkingId
      })
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      
      if (errorData.message) {
        throw new Error(errorData.message);
      } else {
        throw new Error("Failed to update reservation. Please try again later.");
      }
    }
    return await response.json();
  }