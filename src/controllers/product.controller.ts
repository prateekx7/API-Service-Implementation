import { Request, Response } from "express";

import {
  appendProductMedia,
  createProduct,
  getProductById,
  getProducts,
} from "../services/product.service";

import {
  validateUrlArray,
} from "../utils/productValidation";

export function createProductController(
  req: Request,
  res: Response
) {
  const {
    name,
    sku,
    image_urls,
    video_urls,
  } = req.body;

  if (
    !name ||
    typeof name !== "string" ||
    name.trim() === ""
  ) {
    return res.status(400).json({
      error: "name is required",
    });
  }

  if (
    !sku ||
    typeof sku !== "string" ||
    sku.trim() === ""
  ) {
    return res.status(400).json({
      error: "sku is required",
    });
  }

  const imageError = validateUrlArray(
    image_urls,
    "image_urls"
  );

  if (imageError) {
    return res.status(400).json({
      error: imageError,
    });
  }

  const videoError = validateUrlArray(
    video_urls,
    "video_urls"
  );

  if (videoError) {
    return res.status(400).json({
      error: videoError,
    });
  }

  const result = createProduct({
    name,
    sku,
    imageUrls: image_urls || [],
    videoUrls: video_urls || [],
  });

  if ("error" in result) {
    return res.status(result.status ?? 400).json({
      error: result.error,
    });
  }

  return res.status(201).json(result.product);
}

export function getProductsController(
  req: Request,
  res: Response
) {
  let limit = Number(req.query.limit) || 20;
  let offset = Number(req.query.offset) || 0;

  limit = Math.min(limit, 100);

  const products = getProducts(
    limit,
    offset
  );

  return res.json({
    limit,
    offset,
    count: products.length,
    products,
  });
}

export function getProductByIdController(
  req: Request,
  res: Response
) {
  const product = getProductById(
    String(req.params.id)
  );

  if (!product) {
    return res.status(404).json({
      error: "Product not found",
    });
  }

  return res.json(product);
}

export function appendMediaController(
  req: Request,
  res: Response
) {
  const {
    image_urls,
    video_urls,
  } = req.body;

  if (
    !image_urls &&
    !video_urls
  ) {
    return res.status(400).json({
      error:
        "At least one of image_urls or video_urls is required",
    });
  }

  const imageError = validateUrlArray(
    image_urls,
    "image_urls"
  );

  if (imageError) {
    return res.status(400).json({
      error: imageError,
    });
  }

  const videoError = validateUrlArray(
    video_urls,
    "video_urls"
  );

  if (videoError) {
    return res.status(400).json({
      error: videoError,
    });
  }

  const result = appendProductMedia(
    String(req.params.id),
    image_urls || [],
    video_urls || []
  );

  if ("error" in result) {
    return res.status(result.status ?? 400).json({
      error: result.error,
    });
  }

  return res.json(result.product);
}