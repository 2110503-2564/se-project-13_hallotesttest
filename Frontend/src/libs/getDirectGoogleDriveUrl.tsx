export default function getDirectGoogleDriveUrl(url: string): string {
    if (!url || url === "-") return "";
    const match = url.match(/^https:\/\/drive\.google\.com\/file\/d\/([^/]+)/);
    if (match && match[1]) {
        return `https://drive.google.com/uc?id=${match[1]}`;
    }
    return ""; // fallback to original if no match
}