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
export interface BankAccount {
    routingNumber: string;
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
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
    customerPhone: string;
    customerAddress: string;
    totalAmount: bigint;
    items: Array<CartItem>;
    customerEmail: string;
}
export interface backendInterface {
    addBankAccount(accountHolderName: string, bankName: string, accountNumber: string, routingNumber: string): Promise<string>;
    addSnackItem(id: string, name: string, description: string, price: bigint, image: ExternalBlob): Promise<void>;
    addToCart(userId: string, itemId: string, quantity: bigint): Promise<void>;
    checkout(userId: string, customerName: string, customerEmail: string, customerAddress: string, customerPhone: string): Promise<bigint>;
    clearCart(userId: string): Promise<boolean>;
    deleteSnackItem(id: string): Promise<boolean>;
    getAdminOrderManagement(): Promise<Array<Order>>;
    getAllBankAccounts(): Promise<Array<BankAccount>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllSnackItems(): Promise<Array<SnackItem>>;
    getBankAccount(accountNumber: string): Promise<BankAccount | null>;
    getCart(userId: string): Promise<Array<CartItem>>;
    getOrder(orderId: bigint): Promise<Order | null>;
    getSnackItem(id: string): Promise<SnackItem | null>;
}
