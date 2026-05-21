import { Request, Response } from "express";
import { processRequest } from "../services/rateLimiter.service";
import { acquireLock } from "../utils/mutex";
import { rateLimitStore } from "../store/memory.store";

export async function createRequest(
  req: Request,
  res: Response
) {
  const { user_id, payload } = req.body;

  if (
    !user_id ||
    typeof user_id !== "string" ||
    user_id.trim() === ""
  ) {
    return res.status(400).json({
      error: "user_id is required and must be non-empty",
    });
  }

  if (payload === undefined) {
    return res.status(400).json({
      error: "payload is required",
    });
  }

  // Locking user
  const releaseLock = await acquireLock(user_id);

  try {
    const result = processRequest(user_id);

    if (!result.accepted) {
      return res.status(429).json({
        error: result.message,
      });
    }

    return res.status(201).json({
      message: result.message,
    });
  } finally {
    releaseLock();
  }
}

export function getStats(_: Request, res: Response) {
  const stats: Record<string, unknown> = {};

  for (const [userId, data] of rateLimitStore.entries()) {
    stats[userId] = {
      accepted_requests_current_window:
        data.acceptedTimestamps.length,

      rejected_requests_total:
        data.rejectedCount,
    };
  }

  return res.json(stats);
}