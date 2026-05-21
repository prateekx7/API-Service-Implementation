import { Router } from "express";

import {
  createRequest,
  getStats,
} from "../controllers/request.controller";

const router = Router();

router.post("/request", createRequest);

router.get("/stats", getStats);

export default router;