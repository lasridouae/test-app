import { Category } from "./Category";

export class Product {
    id : number;
    name : string;
    category_id : number;
    category?: Category;
    photos : string;
    description : string;
    unit_price : number ;
    low_stock_quantity : number ;
    buying_price : number ;
    stock : number ;
    is_deleted? : boolean;
    created_at? : string;
    updated_at? : string
}
