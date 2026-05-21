export type Product = {
  id: string;
  name: string;
  sku: string;

  imageCount: number;
  videoCount: number;

  thumbnailUrl?: string;

  createdAt: number;
};

export type ProductMedia = {
  imageUrls: string[];
  videoUrls: string[];
};