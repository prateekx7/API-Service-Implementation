import { rateLimitStore } from "../store/memory.store";

const MAX_REQUESTS = 5;
const WINDOW_SIZE_MS = 60 * 1000;

export function processRequest(userId: string) {
  const now = Date.now();

  let userData = rateLimitStore.get(userId);

  if (!userData) {
    userData = {
      acceptedTimestamps: [],
      rejectedCount: 0,
    };

    rateLimitStore.set(userId, userData);
  }


  userData.acceptedTimestamps =
    userData.acceptedTimestamps.filter(
      (timestamp) => now - timestamp < WINDOW_SIZE_MS
    );

  if (userData.acceptedTimestamps.length >= MAX_REQUESTS) {
    userData.rejectedCount++;

    return {
      accepted: false,
      message: "Rate limit exceeded. Max 5 requests per minute.",
    };
  }

  userData.acceptedTimestamps.push(now);

  return {
    accepted: true,
    message: "Request accepted.",
  };
}