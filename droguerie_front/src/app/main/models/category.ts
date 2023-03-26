export class Category {
    id : number;
    parent_id : number;
    level : string;
    name : string ;
    order_level : string;
    icon : string;
    parent_category? : Category;
    is_deleted? : boolean;
    created_at? : string;
    updated_at? : string
}
