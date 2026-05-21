import { UserRateData } from "../types";
import { Product, ProductMedia } from "../types/product.types";

export const rateLimitStore = new Map<string, UserRateData>();



export const productStore = new Map<string, Product>();

export const productMediaStore =
  new Map<string, ProductMedia>();

export const skuToProductIdMap =
  new Map<string, string>();