export interface InputListProductDto{}

export interface Product{
    id: string;
    name: string;
    price: number;
}

export interface OutputListProductDto{
    products: Product[]
}