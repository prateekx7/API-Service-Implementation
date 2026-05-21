import { v4 as uuidv4 } from "uuid";

import {
  productStore,
  productMediaStore,
  skuToProductIdMap,
} from "../store/memory.store";

import {
  Product,
  ProductMedia,
} from "../types/product.types";

export function createProduct(data: {
  name: string;
  sku: string;
  imageUrls: string[];
  videoUrls: string[];
}) {
  if (skuToProductIdMap.has(data.sku)) {
    return {
      error: "SKU already exists",
      status: 409,
    };
  }

  const id = uuidv4();

  const product: Product = {
    id,
    name: data.name,
    sku: data.sku,

    imageCount: data.imageUrls.length,
    videoCount: data.videoUrls.length,

    thumbnailUrl:
      data.imageUrls[0] || undefined,

    createdAt: Date.now(),
  };

  const media: ProductMedia = {
    imageUrls: data.imageUrls,
    videoUrls: data.videoUrls,
  };

  productStore.set(id, product);

  productMediaStore.set(id, media);

  skuToProductIdMap.set(data.sku, id);

  return {
    product,
  };
}

export function getProducts(
  limit: number,
  offset: number
) {
  const products = Array.from(
    productStore.values()
  );

  return products.slice(offset, offset + limit);
}

export function getProductById(id: string) {
  const product = productStore.get(id);

  if (!product) {
    return null;
  }

  const media = productMediaStore.get(id);

  return {
    ...product,
    image_urls: media?.imageUrls || [],
    video_urls: media?.videoUrls || [],
  };
}

export function appendProductMedia(
  id: string,
  imageUrls: string[],
  videoUrls: string[]
) {
  const product = productStore.get(id);

  if (!product) {
    return {
      error: "Product not found",
      status: 404,
    };
  }

  const media = productMediaStore.get(id);

  if (!media) {
    return {
      error: "Media not found",
      status: 404,
    };
  }

  media.imageUrls.push(...imageUrls);

  media.videoUrls.push(...videoUrls);

  product.imageCount =
    media.imageUrls.length;

  product.videoCount =
    media.videoUrls.length;

  if (
    !product.thumbnailUrl &&
    media.imageUrls.length > 0
  ) {
    product.thumbnailUrl =
      media.imageUrls[0];
  }

  return {
    product: {
      ...product,
      image_urls: media.imageUrls,
      video_urls: media.videoUrls,
    },
  };
}