// Utility functions for handling Indian timezone
export function formatDateTimeIST(dateString: string) {
  if (!dateString) return { date: "", time: "", fullDateTime: "" };

  // Manually parse UTC timestamp
  const utcDate = new Date(dateString + "Z"); // Add "Z" to force UTC

  return {
    date: utcDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }),
    time: utcDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }),
    fullDateTime: utcDate.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }),
  };
}

export function calculateDeliveryTimeIST(
  orderTime: string,
  deliveredTime?: string
) {
  if (!deliveredTime) return null;

  // Convert both times to IST
  const orderDate = new Date(
    new Date(orderTime).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  const deliveredDate = new Date(
    new Date(deliveredTime).toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    })
  );

  const diffMs = deliveredDate.getTime() - orderDate.getTime();

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function formatDateIST(dateString: string) {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}
