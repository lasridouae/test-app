import { Product } from "./product";

export class OrderDetail {
    id : number;
    order_id : number;
    product : Product;
    product_id? : number;
    quantity : number ;
    discount : number = 0;
    created_at? : string;
    updated_at? : string
    updated?: boolean;
}
