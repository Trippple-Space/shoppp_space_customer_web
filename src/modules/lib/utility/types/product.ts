export interface ProductCategory {
    id: number
    name: string;
    images: string[];
    description: string | null;
}

export interface Product {
    media: { url: string, type: 'image' | 'video', description?: string, caption?: string }[];
    category: ProductCategory
    price: number;
    name: string;
}