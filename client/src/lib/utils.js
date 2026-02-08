/**
 * Message ke timestamp ko professional format mein convert karne ke liye
 * @param {string | Date} date - Backend se aane wali createdAt date
 * @returns {string} - Formatted time (e.g., 14:30)
 */
export function formatMessageTime(date) {
    if (!date) return ""; // Safety check agar date missing ho

    return new Date(date).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Professional 24-hour format
    });
}