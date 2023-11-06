export interface IProductCategory {
    id: number
    name: string;
    images: string[];
    description: string | null;
}

export interface IProduct {
    media: {url: string, type: 'image'|'video', description?: string, caption?:string}[];
    category: IProductCategory
    price: number;
    name: string;
}