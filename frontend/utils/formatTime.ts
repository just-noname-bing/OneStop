export function formatRelativeTime(timestamp: Date) {
    const currentTimestamp = Date.now();
    const diffInSeconds = Math.max(Math.floor(
        (currentTimestamp - new Date(timestamp).getTime()) / 1000
    ), 0);


    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);

    if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
    }

    let options: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "numeric",
    };

    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 24) {
        return new Date(timestamp).toLocaleString("en-US", options);
    }

    options.year = "2-digit";
    options.month = "2-digit";
    options.day = "2-digit";

    return new Date(timestamp).toLocaleString("en-US", options);
}
