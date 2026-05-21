import { Router } from "express";

import {
  appendMediaController,
  createProductController,
  getProductByIdController,
  getProductsController,
} from "../controllers/product.controller";

const router = Router();

router.post(
  "/products",
  createProductController
);

router.get(
  "/products",
  getProductsController
);

router.get(
  "/products/:id",
  getProductByIdController
);

router.post(
  "/products/:id/media",
  appendMediaController
);

export default router;