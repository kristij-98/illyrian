export type Product = {
  handle: string;
  title: string;
  url: string;
  available?: boolean;
  price?: number | string;
  compareAtPrice?: number | string;
  currency?: string;
  images: string[];
  featuredImage?: string;
  description?: string;
  vendor?: string;
  tags?: string[];
  variants?: { id?: string | number; title?: string; available?: boolean; price?: string | number }[];
  sourceCollections?: string[];
};

export type Collection = {
  handle: string;
  title: string;
  url: string;
  productHandles: string[];
};

export type CartItem = {
  handle: string;
  title: string;
  price?: number | string;
  qty: number;
  image?: string;
  variantTitle?: string;
};
