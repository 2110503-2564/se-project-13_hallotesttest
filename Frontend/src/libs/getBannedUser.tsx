export default async function getBannedUser(token: string, uid: string) {
    try {
        const response = await fetch(
        `https://se13-backend.vercel.app/api/v1/banned/${uid}`,
        {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
            },
        }
        );
    
        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
            errorData.message ||
            "Failed to fetch banned user details. Please try again later."
        );
        }
    
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
}