import { Address } from "./address.model";

export interface User {
    id?: number;
    name: string;
    email: string;
    phone: string;
    addresses: Address[];
}