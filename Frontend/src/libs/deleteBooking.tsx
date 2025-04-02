export default async function deleteBooking(reservationId: string, token: string) {
    const response = await fetch(`https://deepseekxchatgpt-backend.vercel.app/api/v1/reservations/${reservationId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`
      }
    });
  
    if (!response.ok) {
      throw new Error("Failed to delete reservation");
    }
    
    return await response.json();
  }