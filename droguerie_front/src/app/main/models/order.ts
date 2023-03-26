import { Client } from "./client";
import { Fournisseur } from "./fournisseur";
import { OrderDetail } from "./orderDetail";

export class Order {
    id : number;
    client_id : number;
    client?: Client;
    fournisseur?: Fournisseur;
    order_details?: OrderDetail[];
    fournisseur_id : number;
    discount? : number;
    tax? : number;
    payment_type : string;
    payment_status : string;
    grand_total : number;
    date : string ;
    type_order : string ;
    is_deleted? : boolean;
    viewed? : boolean;
    created_at? : string;
    updated_at? : string
}
