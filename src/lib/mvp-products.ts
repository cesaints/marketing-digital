export type MvpProduct = {
  id: string;
  name: string;
  price: number; // preço de venda
  cogs: number; // custo (produto/serviço)
  imageDataUrl?: string; // opcional (base64 / data url)
};

const KEY = "md_mvp_products_v1";

export function loadProducts(): MvpProduct[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveProducts(items: MvpProduct[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}
