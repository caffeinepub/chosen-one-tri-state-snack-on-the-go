import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface SnackItem {
    id: string;
    name: string;
    description: string;
    image: ExternalBlob;
    price: bigint;
}
export interface CartItem {
    item: SnackItem;
    quantity: bigint;
}
export interface Order {
    id: bigint;
    customerName: string;
    customerAddress: string;
    totalAmount: bigint;
    items: Array<CartItem>;
    customerEmail: string;
}
export interface backendInterface {
    addSnackItem(id: string, name: string, description: string, price: bigint, image: ExternalBlob): Promise<void>;
    addToCart(userId: string, itemId: string, quantity: bigint): Promise<void>;
    checkout(userId: string, customerName: string, customerEmail: string, customerAddress: string): Promise<bigint>;
    getAllOrders(): Promise<Array<Order>>;
    getAllSnackItems(): Promise<Array<SnackItem>>;
    getCart(userId: string): Promise<Array<CartItem>>;
    getOrder(orderId: bigint): Promise<Order | null>;
    getSnackItem(id: string): Promise<SnackItem | null>;
}
