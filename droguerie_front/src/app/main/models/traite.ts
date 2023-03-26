import { Client } from "./client";
import { Fournisseur } from "./fournisseur";
import { TraiteDetail } from "./traiteDetail";

export class Traite {
    id : number;
    client_id? : number;
    fournisseur_id? : number;
    client?: Client;
    fournisseur?:Fournisseur;
    order_id : number;
    nbr_traites : number;
    amount_paid : number = 0;
    payment_status : string;
    traite_details? : TraiteDetail[]; 
    viewed? : boolean;
    is_deleted? : boolean;
    created_at? : string;
    updated_at? : string
}
